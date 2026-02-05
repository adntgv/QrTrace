'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { getAnonymousToken } from '@/lib/utils';
import QrCard from '@/components/QrCard';
import type { QrCode } from '@/lib/types';

export default function DashboardPage() {
  const [qrCodes, setQrCodes] = useState<QrCode[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchQrCodes = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    let query = supabase.from('qr_codes').select('*').order('created_at', { ascending: false });

    if (user) {
      query = query.eq('user_id', user.id);
    } else {
      const token = getAnonymousToken();
      query = query.eq('anonymous_token', token);
    }

    const { data } = await query;
    setQrCodes(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchQrCodes();
  }, []);

  const handleToggle = async (id: string, active: boolean) => {
    await supabase.from('qr_codes').update({ is_active: active, updated_at: new Date().toISOString() }).eq('id', id);
    setQrCodes((prev) => prev.map((q) => (q.id === id ? { ...q, is_active: active } : q)));
  };

  const handleDelete = async (id: string) => {
    await supabase.from('qr_codes').delete().eq('id', id);
    setQrCodes((prev) => prev.filter((q) => q.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Manage your QR codes</p>
        </div>
        <Link
          href="/create"
          className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors"
        >
          + New QR Code
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5 animate-pulse">
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-gray-800 rounded-lg" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-800 rounded w-1/3" />
                  <div className="h-3 bg-gray-800 rounded w-2/3" />
                  <div className="h-3 bg-gray-800 rounded w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : qrCodes.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📭</div>
          <h2 className="text-xl font-semibold text-white mb-2">No QR codes yet</h2>
          <p className="text-gray-400 mb-6">Create your first dynamic QR code to get started</p>
          <Link
            href="/create"
            className="inline-block bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            Create QR Code
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {qrCodes.map((qr) => (
            <QrCard key={qr.id} qr={qr} onToggle={handleToggle} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
