-- Create a table for Vendors
create table if not exists public.vendors (
    id uuid default gen_random_uuid() primary key,
    retailer_id uuid references auth.users(id) on delete cascade not null,
    name text not null,
    contact_person text,
    phone text,
    email text,
    address text,
    status text default 'Active',
    created_at timestamp with time zone default now()
);

-- RLS Policies
alter table public.vendors enable row level security;

create policy "Retailers can view their own vendors"
on public.vendors for select
to authenticated
using (auth.uid() = retailer_id);

create policy "Retailers can insert their own vendors"
on public.vendors for insert
to authenticated
with check (auth.uid() = retailer_id);

create policy "Retailers can update their own vendors"
on public.vendors for update
to authenticated
using (auth.uid() = retailer_id);

create policy "Retailers can delete their own vendors"
on public.vendors for delete
to authenticated
using (auth.uid() = retailer_id);
