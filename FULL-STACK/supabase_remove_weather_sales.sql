-- Remove weather and last_month_sales columns
ALTER TABLE products 
DROP COLUMN IF EXISTS temperature_avg,
DROP COLUMN IF EXISTS rainfall_level,
DROP COLUMN IF EXISTS last_month_sales;
