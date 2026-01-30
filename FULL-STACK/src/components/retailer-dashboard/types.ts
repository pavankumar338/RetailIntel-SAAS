export type Customer = {
    id: string
    phone_number: string
    name: string | null
    email: string | null
    total_spend: number
    last_purchase_date: string
}

export type Product = {
    id: string
    custom_product_id?: string
    name: string
    description: string | null
    price: number
    cost_per_unit?: number
    category: string
    product_type?: string
    stock_quantity: number
    sales_count: number
    total_revenue?: number
    profit?: number
    demand_score?: number
    season?: string
    month?: string
    month_num?: number
    is_festival?: boolean
    discount_percent?: number
    is_promo?: boolean
    predicted_sales?: number
    region?: string
    views_count: number
    image_url: string | null
    created_at: string
    expiry_date?: string
    suggested_price?: number
    pricing_reason?: string
}

export type Tab = 'home' | 'products' | 'analytics' | 'predictions' | 'pos' | 'customers' | 'vendors' | 'dynamic_pricing' | 'market_trends' | 'fraud_detection'

export type ActionState = {
    error?: string
    success?: boolean
    message?: string
}

export type Transaction = {
    transaction_id: string
    user_id: string
    customer_phone: string
    items: any[]
    subtotal: number
    tax: number
    total: number
    payment_method: string
    created_at: string
}

export type Vendor = {
    id: string
    name: string
    contact_person: string | null
    phone: string | null
    email: string | null
    address: string | null
    status: string
    created_at: string
}
