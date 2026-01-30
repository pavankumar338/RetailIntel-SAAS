-- Create Products Table
create table if not exists public.products (
  id uuid not null primary key default gen_random_uuid(),
  retailer_id uuid not null, -- references profiles(id)
  name text not null,
  description text,
  price numeric not null,
  category text not null,
  product_type text default 'Physical', -- Physical, Digital, Service
  stock_quantity integer default 0,
  views_count integer default 0,
  sales_count integer default 0,
  image_url text, -- For product image
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Permissions
grant all on table public.products to postgres, anon, authenticated, service_role;

-- RLS
alter table public.products enable row level security;

-- Policy: Retailers can manage their own products
create policy "Retailers can manage their own products" 
on public.products 
for all 
using (retailer_id = auth.uid());

-- Policy: Public can view products
create policy "Public can view products" 
on public.products 
for select 
using (true);

-- Indexes for performance
create index if not exists idx_products_retailer on public.products(retailer_id);
create index if not exists idx_products_category on public.products(category);
