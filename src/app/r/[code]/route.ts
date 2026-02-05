import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function parseDevice(ua: string | null): string {
  if (!ua) return 'Unknown';
  if (/mobile|android|iphone|ipod/i.test(ua)) return 'Mobile';
  if (/ipad|tablet/i.test(ua)) return 'Tablet';
  return 'Desktop';
}

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  const code = params.code;

  // Fetch QR code
  const { data: qr, error } = await supabase
    .from('qr_codes')
    .select('id, destination_url, is_active')
    .eq('short_code', code)
    .single();

  if (error || !qr) {
    return NextResponse.redirect(new URL('/?error=not_found', request.url));
  }

  if (!qr.is_active) {
    return NextResponse.redirect(new URL('/?error=inactive', request.url));
  }

  // Log scan asynchronously (don't block redirect)
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') || 'unknown';
  const userAgent = request.headers.get('user-agent');
  const referrer = request.headers.get('referer') || request.headers.get('referrer');

  // Attempt geo lookup from headers (common in Vercel/Cloudflare)
  const country = request.headers.get('x-vercel-ip-country') ||
    request.headers.get('cf-ipcountry') ||
    null;
  const city = request.headers.get('x-vercel-ip-city') ||
    request.headers.get('cf-ipcity') ||
    null;

  // Fire and forget: log scan + increment counter
  const scanPromise = supabase.from('qr_scans').insert({
    qr_id: qr.id,
    ip,
    user_agent: userAgent,
    referrer,
    country,
    city,
    device_type: parseDevice(userAgent),
  });

  const countPromise = supabase.rpc('increment_scan_count', { qr_id_input: qr.id }).then((res) => {
    // Fallback if RPC doesn't exist yet
    if (res.error) {
      return supabase
        .from('qr_codes')
        .update({ scan_count: (qr as Record<string, unknown>).scan_count as number + 1 })
        .eq('id', qr.id);
    }
  });

  // Don't await — redirect immediately
  Promise.all([scanPromise, countPromise]).catch(() => {});

  return NextResponse.redirect(qr.destination_url, { status: 302 });
}
