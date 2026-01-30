-- Create a table for Transactions
create table if not exists public.transactions (
    transaction_id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    customer_phone text,
    items jsonb not null, -- Stores the array of items at the time of purchase
    subtotal numeric not null,
    tax numeric default 0,
    total numeric not null,
    payment_method text not null, -- 'cash' or 'upi'
    created_at timestamp with time zone default now()
);

-- RLS Policies
alter table public.transactions enable row level security;

create policy "Retailers can view their own transactions"
on public.transactions for select
to authenticated
using (auth.uid() = user_id);

create policy "Retailers can insert their own transactions"
on public.transactions for insert
to authenticated
with check (auth.uid() = user_id);
