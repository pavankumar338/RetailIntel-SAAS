import os
import pandas as pd
import numpy as np
import xgboost as xgb
from supabase import create_client, Client
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from dotenv import load_dotenv
import datetime

# Load environment variables
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'FULL-STACK', '.env.local')
if os.path.exists(env_path):
    load_dotenv(dotenv_path=env_path)
    print(f"Loaded environment from {env_path}")
else:
    load_dotenv()

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: Missing Supabase credentials.")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def fetch_data():
    # Verify columns exist first to avoid mid-run crashes
    response = supabase.table('products').select("*").limit(1).execute()
    if response.data:
        keys = response.data[0].keys()
        if 'suggested_price' not in keys or 'pricing_reason' not in keys:
            print("\n❌ DATABASE ERROR: Missing required columns.")
            print("Please run the SQL in 'FULL-STACK/supabase_pricing_init.sql' in your Supabase SQL Editor first.")
            print("Then try running this script again.\n")
            exit(1)
            
    response = supabase.table('products').select("*").execute()
    return pd.DataFrame(response.data)

def get_season(month_num):
    if month_num in [3, 4, 5, 6]: return 'Summer'
    if month_num in [7, 8, 9, 10]: return 'Monsoon'
    return 'Winter'

def preprocess_data(df):
    target = 'sales_count'
    features = [
        'price', 'cost_per_unit', 'stock_quantity',
        'demand_score', 'category', 'season', 'region',
        'month_num', 'is_festival', 'is_promo', 'discount_percent',
    ]

    df = df.copy()
    for col in ['cost_per_unit', 'demand_score', 'price', 'stock_quantity', 'month_num', 'discount_percent']:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)
    
    if 'month_num' not in df.columns:
        df['month_num'] = 1
    
    if 'season' not in df.columns:
        df['season'] = df['month_num'].apply(get_season)
    else:
        df['season'] = df['season'].fillna(df['month_num'].apply(get_season))

    for col in ['region', 'category', 'season']:
        df[col] = df[col].fillna('Unknown').astype(str)

    # Label Encoding
    encoders = {}
    X = df.copy()
    for col in ['category', 'season', 'region']:
        le = LabelEncoder()
        le.fit(list(set(X[col].unique().tolist() + ['Summer', 'Winter', 'Monsoon', 'Unknown'])))
        X[col] = le.transform(X[col])
        encoders[col] = le

    return X, df[target].fillna(0).values, encoders, features

def train_demand_model(X, y, features):
    X_train, X_test, y_train, y_test = train_test_split(X[features], y, test_size=0.1, random_state=42)
    
    model = xgb.XGBRegressor(
        objective='reg:squarederror',
        n_estimators=100,
        learning_rate=0.08,
        max_depth=5,
        random_state=42
    )
    model.fit(X_train, y_train)
    return model

def optimize_pricing(df, model, encoders, features):
    print("\nRunning Dynamic Price Optimization...")
    now = datetime.datetime.now()
    current_month = now.month
    current_season = get_season(current_month)
    
    # Encode current season
    season_code = encoders['season'].transform([current_season])[0]

    updated_optimization = []

    for i, product in df.iterrows():
        pid = product['id']
        name = product['name']
        cost = float(product.get('cost_per_unit', 0))
        current_price = float(product['price'])
        
        # Define price candidates: range around current price
        # Try -30% to +50% steps
        price_candidates = np.linspace(max(cost * 1.05, current_price * 0.7), current_price * 1.5, 20)
        
        best_price = current_price
        max_profit = -np.inf
        best_demand = 0
        
        # Prepare feature vector for this product
        prod_features = product.copy()
        
        # Force current context
        prod_features['month_num'] = current_month
        prod_features['season'] = current_season # Raw for encoding
        
        # Encode categorical features for this product
        for col in ['category', 'season', 'region']:
            val = str(prod_features[col])
            prod_features[col] = encoders[col].transform([val if val in encoders[col].classes_ else 'Unknown'])[0]

        # Simulation
        results = []
        for p in price_candidates:
            sim_features = prod_features.copy()
            sim_features['price'] = p
            
            # Predict demand at price p
            # Feature ordering must match training
            X_input = pd.DataFrame([sim_features[features]])
            predicted_demand = float(model.predict(X_input[features])[0])
            predicted_demand = max(0, predicted_demand)
            
            # Profit = (Price - Cost) * Demand
            profit = (p - cost) * predicted_demand
            
            if profit > max_profit:
                max_profit = profit
                best_price = p
                best_demand = predicted_demand
            
            results.append((p, profit))

        # Determine Reason
        change_pct = ((best_price - current_price) / current_price) * 100
        if change_pct > 2:
            reason = f"AI predicts {best_demand:.1f} units demand at ₹{best_price:.2f}. High demand confidence."
        elif change_pct < -2:
            reason = f"Inventory velocity is low. Suggest discount to ₹{best_price:.2f} to boost sales."
        else:
            reason = "Current price is mathematically optimal for profit maximization."

        # Update Supabase
        try:
            supabase.table('products').update({
                'suggested_price': float(best_price),
                'pricing_reason': reason
            }).eq('id', pid).execute()
        except Exception as e:
            print(f"Failed to update {name}: {e}")

        if (i+1) % 5 == 0:
            print(f"Optimized {i+1}/{len(df)} products...")

    print("Dynamic Pricing Optimization Complete.")

def main():
    df = fetch_data()
    if df.empty:
        print("No products to optimize.")
        return
    
    X_encoded, y, encoders, features = preprocess_data(df)
    model = train_demand_model(X_encoded, y, features)
    optimize_pricing(df, model, encoders, features)

if __name__ == "__main__":
    main()
