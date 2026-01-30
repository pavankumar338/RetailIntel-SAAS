-- Add weather-related columns for demand forecasting
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS temperature_avg NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS rainfall_level NUMERIC DEFAULT 0;
