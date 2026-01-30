-- Add new fields to products table
alter table public.products 
add column if not exists cost_per_unit numeric default 0,
add column if not exists season text,
add column if not exists month text,
add column if not exists total_revenue numeric default 0,
add column if not exists profit numeric default 0,
add column if not exists demand_score numeric default 0,
add column if not exists custom_product_id text,
add column if not exists region text;
add column product_id int;