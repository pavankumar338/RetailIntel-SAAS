-- Add AI Pricing columns to products table
alter table public.products 
add column if not exists suggested_price numeric,
add column if not exists pricing_reason text;
