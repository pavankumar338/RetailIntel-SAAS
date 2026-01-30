-- Add predicted_sales column to store ML results
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS predicted_sales NUMERIC DEFAULT 0;
