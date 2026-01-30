import os
import pandas as pd
import xgboost as xgb
from supabase import create_client, Client
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_squared_error, r2_score
from dotenv import load_dotenv

# Load environment variables
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'FULL-STACK', '.env.local')
if os.path.exists(env_path):
    load_dotenv(dotenv_path=env_path)
    print(f"Loaded environment from {env_path}")
else:
    load_dotenv()
    print("Loaded environment from default location or environment variables")

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL") 
# Prefer Service Role Key for backend scripts to bypass RLS, fallback to Anon Key
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

if not SUPABASE_KEY:
    print("Warning: No SUPABASE_KEY found. Please check your .env.local file.")
    print("Ensure you have NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY set.") 

def fetch_data():
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise ValueError("Supabase credentials missing.")

    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    response = supabase.table('products').select("*").execute()
    return pd.DataFrame(response.data)

import datetime

def get_season_from_month(month_num):
    if month_num in [3, 4, 5, 6]:
        return 'Summer'
    elif month_num in [7, 8, 9, 10]:
        return 'Monsoon'
    else:
        return 'Winter' # 11, 12, 1, 2

def preprocess_data(df):
    # Target
    target = 'sales_count'

    # Features
    features = [
        'price', 'cost_per_unit', 'stock_quantity',
        'demand_score', 'category', 'season', 'region',
        'month_num', 'is_festival', 'is_promo', 'discount_percent',
    ]

    df = df.copy()

    # Handle missing values
    for col in ['cost_per_unit', 'demand_score', 'price', 'stock_quantity']:
        if col in df.columns:
            df[col] = df[col].fillna(0)
    
    # Auto-fill month_num if available from created_at or assume 1 (Jan) if missing
    if 'month_num' not in df.columns:
        df['month_num'] = 1 # Default
    else:
        df['month_num'] = df['month_num'].fillna(1).astype(int)

    # Intelligent Season Derivation
    if 'season' in df.columns:
        # Fill missing seasons based on month_num
        missing_season = df['season'].isna() | (df['season'] == 'Unknown')
        if missing_season.any():
            df.loc[missing_season, 'season'] = df.loc[missing_season, 'month_num'].apply(get_season_from_month)
    else:
        df['season'] = df['month_num'].apply(get_season_from_month)

    for col in ['region', 'category', 'season']:
        if col in df.columns:
            df[col] = df[col].fillna('Unknown')
    
    # Ensure all features exist
    for feature in features:
        if feature not in df.columns:
            df[feature] = 0

    X = df[features]
    y = df[target].fillna(0)

    # Encode categorical columns separately
    encoders = {}
    for col in ['category', 'season', 'region']:
        le = LabelEncoder()
        # Ensure we fit on all likely categories including our hardcoded seasons
        # This prevents error if training data lacks 'Winter' e.g.
        known_classes = X[col].astype(str).unique().tolist()
        if col == 'season':
            known_classes.extend(['Summer', 'Winter', 'Monsoon'])
        
        le.fit(list(set(known_classes)))
        
        X[col] = le.transform(X[col].astype(str))
        encoders[col] = le

    return X, y, encoders

def train_model(X, y):
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model = xgb.XGBRegressor(
        objective='reg:squarederror',
        n_estimators=200,
        learning_rate=0.1,
        max_depth=6,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42
    )

    print("Training XGBoost model...")
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)

    mse = mean_squared_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)

    print("\nModel Performance")
    print("---------------------")
    print(f"MSE : {mse:.2f}")
    print(f"R2  : {r2:.2f}")

    return model

def update_predictions(df, model, X, encoders):
    """Updates Supabase with predicted values (Forecasting for CURRENT Real-World Month)."""
    print("\nUpdating predictions in Supabase based on CURRENT trends...")
    
    # 1. Determine Current Context
    now = datetime.datetime.now()
    current_month = now.month
    current_season = get_season_from_month(current_month)
    
    print(f"Current Time Context: Month={current_month} ({now.strftime('%B')}), Season={current_season}")

    # 2. Create Forecast Dataset (X_forecast)
    # We take the product metadata (price, category, etc.) but FORCE the time-based features
    # to match the CURRENT month/season, not the historical one in the DB.
    # This gives us a "What will this product sell like THIS month?" prediction.
    X_forecast = X.copy()
    
    # Update Season
    if 'season' in encoders:
        # We need to transform the single string 'Summer'/'Winter' into its integer code
        season_code = encoders['season'].transform([current_season])[0]
        X_forecast['season'] = season_code
    
    # Update Month
    X_forecast['month_num'] = current_month
    
    # Predict
    predictions = model.predict(X_forecast)
    
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    print(f"Updating {len(df)} records with forecasts...")
    
    for i, idx in enumerate(df.index):
        pid = str(df.loc[idx, 'id'])
        pred = float(predictions[i])
        
        # Ensure non-negative
        pred = max(0, pred)
        
        try:
            # We explicitly mention this is a prediction for the current context
            supabase.table('products').update({
                'predicted_sales': pred,
                # Optionally, if we had columns, we could update 'current_season_trend': current_season 
            }).eq('id', pid).execute()
        except Exception as e:
            print(f"Failed to update product {pid}: {e}")
            
        if (i + 1) % 10 == 0:
            print(f"Progress: {i + 1}/{len(df)}")

    print("Prediction update complete.")

def main():
    try:
        print("Fetching data from Supabase...")
        df = fetch_data()

        if df.empty:
            print("No data found in database.")
            return

        print(f"Total Records: {len(df)}")

        print("Preprocessing data...")
        X, y, encoders = preprocess_data(df)

        print("Training model (on historical/avail data)...")
        model = train_model(X, y)

        # Update DB with predictions for the CURRENT real-world scenario
        update_predictions(df, model, X, encoders)
        
        # Sample log for diagnostics
        print("\n--- Diagnostic Sample (Current Forecast) ---")
        sample_idx = 0
        sample_row = X.iloc[[sample_idx]].copy() # Original data
        
        # Transform sample to current time like we did in update_predictions
        now = datetime.datetime.now()
        cur_season = get_season_from_month(now.month)
        if 'season' in encoders:
            sample_row['season'] = encoders['season'].transform([cur_season])[0]
        sample_row['month_num'] = now.month
        
        pred_val = model.predict(sample_row)[0]
        
        prod_name = df.iloc[sample_idx].get('name', 'Unknown Product')
        print(f"Product: {prod_name}")
        print(f"Simulating for: {now.strftime('%B')} ({cur_season})")
        print(f"Predicted Sales: {pred_val:.2f}")

    except Exception as e:
        print("Error:", str(e))

if __name__ == "__main__":
    main()
