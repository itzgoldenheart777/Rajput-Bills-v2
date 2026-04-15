-- ============================================================
-- RAJPUT UNIFIED — Full Supabase Schema
-- Run this ONCE in Supabase SQL Editor
-- Covers: Bills, Road Tax, Driver Pagar
-- ============================================================

-- ── 1. BILLS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  bill_no TEXT NOT NULL,
  date TEXT,
  client_name TEXT NOT NULL,
  route TEXT,
  duty_slip TEXT, car_type TEXT, car_no TEXT,
  amount NUMERIC, particulars_rate TEXT,
  total_kms TEXT, extra_kms TEXT, extra_kms_rate TEXT,
  total_hrs TEXT, extra_hrs TEXT, extra_hrs_rate TEXT,
  trip_cost NUMERIC, toll NUMERIC, da NUMERIC, final_total NUMERIC,
  outstation TEXT, outstation_extra TEXT, outstation_rate TEXT,
  toll_parking TEXT, toll_amount NUMERIC, driver_allowance TEXT,
  car_used_by TEXT, car_booked_by TEXT
);
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on bills" ON bills FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS saved_cars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  car_no TEXT NOT NULL,
  car_type TEXT
);
ALTER TABLE saved_cars ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on saved_cars" ON saved_cars FOR ALL USING (true) WITH CHECK (true);

-- ── 2. ROAD TAX ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_number TEXT NOT NULL UNIQUE,
  chassis_last5 TEXT NOT NULL,
  owner_name TEXT,
  vehicle_type TEXT DEFAULT 'Private',
  mobile_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on vehicles" ON vehicles FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS tax_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  vehicle_number TEXT NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  period_label TEXT NOT NULL,
  tax_type TEXT DEFAULT 'MONTHLY',
  amount NUMERIC(10,2),
  receipt_filename TEXT,
  receipt_url TEXT,
  status TEXT DEFAULT 'PENDING',
  payment_date TIMESTAMPTZ,
  transaction_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE tax_payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on tax_payments" ON tax_payments FOR ALL USING (true) WITH CHECK (true);

-- Vehicle status view with days-until-expiry
CREATE OR REPLACE VIEW vehicle_status AS
SELECT
  v.*,
  tp.period_end   AS last_tax_end,
  tp.period_label AS last_period,
  tp.status       AS last_payment_status,
  tp.receipt_filename,
  tp.receipt_url,
  (tp.period_end - CURRENT_DATE) AS days_until_expiry
FROM vehicles v
LEFT JOIN LATERAL (
  SELECT * FROM tax_payments
  WHERE vehicle_id = v.id AND status = 'PAID'
  ORDER BY period_end DESC LIMIT 1
) tp ON true;

-- ── 3. DRIVER PAGAR ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS drivers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  vehicle_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on drivers" ON drivers FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS pagar_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
  driver_name TEXT NOT NULL,
  week_start DATE NOT NULL,

  -- Per-app breakdown
  uber_earning NUMERIC DEFAULT 0,   uber_cash NUMERIC DEFAULT 0,   uber_toll NUMERIC DEFAULT 0,
  ola_earning  NUMERIC DEFAULT 0,   ola_cash  NUMERIC DEFAULT 0,   ola_toll  NUMERIC DEFAULT 0,
  rapido_earning NUMERIC DEFAULT 0, rapido_cash NUMERIC DEFAULT 0, rapido_toll NUMERIC DEFAULT 0,
  private_earning NUMERIC DEFAULT 0,private_cash NUMERIC DEFAULT 0,private_toll NUMERIC DEFAULT 0,

  -- Expenses
  cng NUMERIC DEFAULT 0,
  fees NUMERIC DEFAULT 0,

  -- Calculated totals
  total_earning  NUMERIC DEFAULT 0,
  total_cash     NUMERIC DEFAULT 0,
  total_toll     NUMERIC DEFAULT 0,
  base_profit    NUMERIC DEFAULT 0,
  pagar          NUMERIC DEFAULT 0,
  total_after_cng NUMERIC DEFAULT 0,
  after_pagar    NUMERIC DEFAULT 0,
  payout         NUMERIC DEFAULT 0,
  prev_balance   NUMERIC DEFAULT 0,
  final_payout   NUMERIC DEFAULT 0,

  notes TEXT
);
ALTER TABLE pagar_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on pagar_records" ON pagar_records FOR ALL USING (true) WITH CHECK (true);

-- ── 4. INDEXES ───────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_bills_bill_no     ON bills(bill_no);
CREATE INDEX IF NOT EXISTS idx_bills_client      ON bills(client_name);
CREATE INDEX IF NOT EXISTS idx_bills_created     ON bills(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tax_period_end    ON tax_payments(period_end);
CREATE INDEX IF NOT EXISTS idx_tax_vehicle       ON tax_payments(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_pagar_driver      ON pagar_records(driver_id);
CREATE INDEX IF NOT EXISTS idx_pagar_week        ON pagar_records(week_start DESC);

-- ── 5. STORAGE BUCKETS ───────────────────────────────────────
-- Run in Dashboard → Storage → New Bucket:
--   Name: brand-assets  (public: YES)
--   Name: receipts      (public: YES)
--
-- Or via SQL (requires storage extension):
INSERT INTO storage.buckets (id, name, public) VALUES ('brand-assets', 'brand-assets', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('receipts', 'receipts', true) ON CONFLICT DO NOTHING;

CREATE POLICY IF NOT EXISTS "Public read brand-assets" ON storage.objects FOR SELECT USING (bucket_id='brand-assets');
CREATE POLICY IF NOT EXISTS "Upload brand-assets"      ON storage.objects FOR INSERT WITH CHECK (bucket_id='brand-assets');
CREATE POLICY IF NOT EXISTS "Public read receipts"     ON storage.objects FOR SELECT USING (bucket_id='receipts');
CREATE POLICY IF NOT EXISTS "Upload receipts"          ON storage.objects FOR INSERT WITH CHECK (bucket_id='receipts');
