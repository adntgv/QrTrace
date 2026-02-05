-- QrTrace Database Schema
-- Run this migration in Supabase SQL Editor

-- QR Codes table
CREATE TABLE IF NOT EXISTS qr_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  anonymous_token TEXT,
  short_code TEXT UNIQUE NOT NULL,
  destination_url TEXT NOT NULL,
  title TEXT,
  fg_color TEXT DEFAULT '#000000',
  bg_color TEXT DEFAULT '#FFFFFF',
  is_active BOOLEAN DEFAULT TRUE,
  scan_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- QR Scans table (analytics)
CREATE TABLE IF NOT EXISTS qr_scans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  qr_id UUID REFERENCES qr_codes(id) ON DELETE CASCADE NOT NULL,
  ip TEXT,
  user_agent TEXT,
  referrer TEXT,
  country TEXT,
  city TEXT,
  device_type TEXT,
  scanned_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_qr_codes_short_code ON qr_codes(short_code);
CREATE INDEX IF NOT EXISTS idx_qr_codes_user_id ON qr_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_anonymous_token ON qr_codes(anonymous_token);
CREATE INDEX IF NOT EXISTS idx_qr_scans_qr_id ON qr_scans(qr_id);
CREATE INDEX IF NOT EXISTS idx_qr_scans_scanned_at ON qr_scans(scanned_at);

-- Row Level Security
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_scans ENABLE ROW LEVEL SECURITY;

-- Policies for qr_codes
CREATE POLICY "Users manage own QR codes" ON qr_codes
  FOR ALL USING (
    auth.uid() = user_id
    OR user_id IS NULL
  );

CREATE POLICY "Anyone can view active QR" ON qr_codes
  FOR SELECT USING (is_active = TRUE);

-- Policies for qr_scans
CREATE POLICY "Anyone can log scans" ON qr_scans
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "QR owners view scans" ON qr_scans
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM qr_codes
      WHERE qr_codes.id = qr_scans.qr_id
      AND (qr_codes.user_id = auth.uid() OR qr_codes.user_id IS NULL)
    )
  );

-- Function to atomically increment scan count
CREATE OR REPLACE FUNCTION increment_scan_count(qr_id_input UUID)
RETURNS void AS $$
BEGIN
  UPDATE qr_codes
  SET scan_count = scan_count + 1,
      updated_at = NOW()
  WHERE id = qr_id_input;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
