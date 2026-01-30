-- Create a table for Retailer's POS Customers
create table if not exists public.pos_customers (
    id uuid default gen_random_uuid() primary key,
    retailer_id uuid references auth.users(id) on delete cascade not null,
    phone_number text not null,
    name text default 'Guest',
    email text,
    total_spend numeric default 0,
    last_purchase_date timestamp with time zone default now(),
    created_at timestamp with time zone default now(),
    unique (retailer_id, phone_number)
);

-- RLS Policies
alter table public.pos_customers enable row level security;

create policy "Retailers can view their own customers"
on public.pos_customers for select
to authenticated
using (auth.uid() = retailer_id);

create policy "Retailers can insert their own customers"
on public.pos_customers for insert
to authenticated
with check (auth.uid() = retailer_id);

create policy "Retailers can update their own customers"
on public.pos_customers for update
to authenticated
using (auth.uid() = retailer_id);

create policy "Retailers can delete their own customers"
on public.pos_customers for delete
to authenticated
using (auth.uid() = retailer_id);
