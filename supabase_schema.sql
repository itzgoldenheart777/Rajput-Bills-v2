-- =============================================
-- Rajput Tour & Travels - Bills Database Schema
-- Run this in your Supabase SQL Editor
-- =============================================

CREATE TABLE IF NOT EXISTS bills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Bill header
  bill_no TEXT NOT NULL,
  date TEXT,
  client_name TEXT NOT NULL,
  route TEXT,

  -- Car info
  duty_slip TEXT,
  car_type TEXT,
  car_no TEXT,

  -- Amount
  amount NUMERIC,
  particulars_rate TEXT,

  -- Kilometers
  total_kms TEXT,
  extra_kms TEXT,
  extra_kms_rate TEXT,

  -- Hours
  total_hrs TEXT,
  extra_hrs TEXT,
  extra_hrs_rate TEXT,

  -- Auto Calculation Engine Storage
  trip_cost NUMERIC,
  toll NUMERIC,
  da NUMERIC,
  final_total NUMERIC,

  -- Outstation
  outstation TEXT,
  outstation_extra TEXT,
  outstation_rate TEXT,

  -- Extras
  toll_parking TEXT,
  toll_amount NUMERIC,
  driver_allowance TEXT,

  -- Usage
  car_used_by TEXT,
  car_booked_by TEXT
);

-- Enable Row Level Security (RLS)
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;

-- Allow all operations for now (customize as needed)
CREATE POLICY "Allow all operations" ON bills
  FOR ALL USING (true) WITH CHECK (true);

-- Index for fast search
CREATE INDEX IF NOT EXISTS bills_bill_no_idx ON bills (bill_no);
CREATE INDEX IF NOT EXISTS bills_client_name_idx ON bills (client_name);
CREATE INDEX IF NOT EXISTS bills_created_at_idx ON bills (created_at DESC);

-- =============================================
-- Brand Assets Storage Bucket
-- Run these in your Supabase Dashboard → Storage
-- OR via the SQL Editor using Supabase's storage API
-- =============================================

-- 1. Go to Supabase Dashboard → Storage → New Bucket
-- 2. Name it: brand-assets
-- 3. Toggle ON "Public bucket"
-- 4. Click Create bucket

-- Alternatively, via SQL (requires pg_storage extension):
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('brand-assets', 'brand-assets', true)
-- ON CONFLICT DO NOTHING;

-- Allow public reads and authenticated uploads for brand-assets bucket:
-- (Run in SQL Editor)
-- CREATE POLICY "Public read brand assets"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'brand-assets');

-- CREATE POLICY "Allow uploads to brand assets"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'brand-assets');

-- CREATE POLICY "Allow updates to brand assets"
--   ON storage.objects FOR UPDATE
--   USING (bucket_id = 'brand-assets');
