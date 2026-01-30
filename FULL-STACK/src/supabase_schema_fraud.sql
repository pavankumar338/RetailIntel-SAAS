
-- Create a table to store fraud alerts
create table if not exists fraud_alerts (
  id uuid default gen_random_uuid() primary key,
  retailer_id uuid references auth.users(id) not null,
  transaction_id uuid references transactions(transaction_id), -- transaction_id is the PK
  severity text not null check (severity in ('low', 'medium', 'high', 'critical')),
  alert_type text not null,
  description text not null,
  details jsonb,
  created_at timestamptz default now()
);

-- Enable RLS
alter table fraud_alerts enable row level security;

-- Policy: Retailers can only view their own alerts
create policy "Retailers can view their own fraud alerts"
  on fraud_alerts for select
  using (auth.uid() = retailer_id);

-- Policy: Retailers can insert alerts (via server actions)
create policy "Retailers can insert fraud alerts"
  on fraud_alerts for insert
  with check (auth.uid() = retailer_id);
