-- Run this block in your Supabase SQL Editor to add the new Auto-Calculation Engine fields to your existing bills table.

ALTER TABLE bills 
ADD COLUMN IF NOT EXISTS trip_cost NUMERIC,
ADD COLUMN IF NOT EXISTS toll NUMERIC,
ADD COLUMN IF NOT EXISTS da NUMERIC,
ADD COLUMN IF NOT EXISTS final_total NUMERIC;

-- Note: outstation and driver_allowance already existed as TEXT fields in your previous schema. 
-- The new app sends numeric string values to those old fields for backwards compatibility while also saving `final_total` to `amount`.
