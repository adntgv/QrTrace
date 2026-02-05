import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { generateShortCode } from '@/lib/utils';

export async function GET(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  const anonymousToken = request.nextUrl.searchParams.get('anonymous_token');

  let query = supabase.from('qr_codes').select('*').order('created_at', { ascending: false });

  if (user) {
    query = query.eq('user_id', user.id);
  } else if (anonymousToken) {
    query = query.eq('anonymous_token', anonymousToken);
  } else {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  const body = await request.json();
  const { destination_url, title, fg_color, bg_color, anonymous_token } = body;

  if (!destination_url) {
    return NextResponse.json({ error: 'destination_url is required' }, { status: 400 });
  }

  // Check limit for anonymous users (3 max)
  if (!user && anonymous_token) {
    const { count } = await supabase
      .from('qr_codes')
      .select('*', { count: 'exact', head: true })
      .eq('anonymous_token', anonymous_token);

    if (count !== null && count >= 3) {
      return NextResponse.json(
        { error: 'Free limit reached (3 QR codes). Sign up for unlimited access!' },
        { status: 403 }
      );
    }
  }

  const short_code = generateShortCode();

  const { data, error } = await supabase
    .from('qr_codes')
    .insert({
      user_id: user?.id || null,
      anonymous_token: user ? null : anonymous_token || null,
      short_code,
      destination_url,
      title: title || null,
      fg_color: fg_color || '#000000',
      bg_color: bg_color || '#FFFFFF',
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
