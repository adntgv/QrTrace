export interface QrCode {
  id: string;
  user_id: string | null;
  anonymous_token: string | null;
  short_code: string;
  destination_url: string;
  title: string | null;
  fg_color: string;
  bg_color: string;
  is_active: boolean;
  scan_count: number;
  created_at: string;
  updated_at: string;
}

export interface QrScan {
  id: string;
  qr_id: string;
  ip: string | null;
  user_agent: string | null;
  referrer: string | null;
  country: string | null;
  city: string | null;
  device_type: string | null;
  scanned_at: string;
}

export interface QrFormData {
  destination_url: string;
  title?: string;
  fg_color: string;
  bg_color: string;
}

export interface ScanStats {
  total_scans: number;
  scans_by_day: { date: string; count: number }[];
  top_countries: { country: string; count: number }[];
  device_breakdown: { device: string; count: number }[];
  top_referrers: { referrer: string; count: number }[];
}
