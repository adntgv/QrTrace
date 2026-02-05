'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { formatNumber, formatDate, getBaseUrl } from '@/lib/utils';
import QrGenerator from '@/components/QrGenerator';
import QrDownload from '@/components/QrDownload';
import { ScansOverTime, TopCountries, DeviceBreakdown } from '@/components/ScanChart';
import type { QrCode, QrScan } from '@/lib/types';

export default function QrAnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const supabase = createClient();

  const [qr, setQr] = useState<QrCode | null>(null);
  const [scans, setScans] = useState<QrScan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [newUrl, setNewUrl] = useState('');

  useEffect(() => {
    const fetch = async () => {
      const { data: qrData } = await supabase.from('qr_codes').select('*').eq('id', id).single();
      if (!qrData) {
        router.push('/dashboard');
        return;
      }
      setQr(qrData);
      setNewUrl(qrData.destination_url);

      const { data: scanData } = await supabase
        .from('qr_scans')
        .select('*')
        .eq('qr_id', id)
        .order('scanned_at', { ascending: false })
        .limit(1000);
      setScans(scanData || []);
      setLoading(false);
    };
    fetch();
  }, [id]);

  const handleUpdateUrl = async () => {
    if (!qr || !newUrl) return;
    await supabase
      .from('qr_codes')
      .update({ destination_url: newUrl, updated_at: new Date().toISOString() })
      .eq('id', qr.id);
    setQr({ ...qr, destination_url: newUrl });
    setEditing(false);
  };

  if (loading || !qr) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-800 rounded w-1/3" />
          <div className="h-4 bg-gray-800 rounded w-1/2" />
          <div className="grid md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-800 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const redirectUrl = `${getBaseUrl()}/r/${qr.short_code}`;

  // Process scan data for charts
  const scansByDay = scans.reduce<Record<string, number>>((acc, s) => {
    const day = s.scanned_at.slice(0, 10);
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});
  const scansByDayArray = Object.entries(scansByDay)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));

  const countryMap = scans.reduce<Record<string, number>>((acc, s) => {
    const c = s.country || 'Unknown';
    acc[c] = (acc[c] || 0) + 1;
    return acc;
  }, {});
  const topCountries = Object.entries(countryMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));

  const deviceMap = scans.reduce<Record<string, number>>((acc, s) => {
    const d = s.device_type || 'Unknown';
    acc[d] = (acc[d] || 0) + 1;
    return acc;
  }, {});
  const deviceData = Object.entries(deviceMap).map(([name, value]) => ({ name, value }));

  const referrerMap = scans.reduce<Record<string, number>>((acc, s) => {
    const r = s.referrer || 'Direct';
    acc[r] = (acc[r] || 0) + 1;
    return acc;
  }, {});
  const topReferrers = Object.entries(referrerMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-8 mb-10">
        <div className="flex-1">
          <button onClick={() => router.push('/dashboard')} className="text-gray-400 hover:text-white text-sm mb-4 flex items-center gap-1">
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-white">{qr.title || qr.short_code}</h1>

          <div className="mt-4 space-y-3">
            <div>
              <label className="text-xs text-gray-500">Redirect URL</label>
              <div className="flex items-center gap-2">
                <code className="text-brand-400 text-sm break-all">{redirectUrl}</code>
                <button
                  onClick={() => navigator.clipboard.writeText(redirectUrl)}
                  className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-2 py-1 rounded transition-colors flex-shrink-0"
                >
                  Copy
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500">Destination</label>
              {editing ? (
                <div className="flex gap-2 mt-1">
                  <input
                    type="url"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
                  />
                  <button onClick={handleUpdateUrl} className="bg-brand-600 hover:bg-brand-700 text-white px-3 py-2 rounded-lg text-sm">
                    Save
                  </button>
                  <button onClick={() => setEditing(false)} className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-2 rounded-lg text-sm">
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <a href={qr.destination_url} target="_blank" className="text-gray-300 text-sm hover:text-white break-all">
                    {qr.destination_url}
                  </a>
                  <button
                    onClick={() => setEditing(true)}
                    className="text-xs text-brand-400 hover:text-brand-300 flex-shrink-0"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>Created {formatDate(qr.created_at)}</span>
              <span className={qr.is_active ? 'text-green-400' : 'text-red-400'}>
                {qr.is_active ? '● Active' : '● Inactive'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <QrGenerator url={redirectUrl} fgColor={qr.fg_color} bgColor={qr.bg_color} size={180} />
          <QrDownload url={redirectUrl} fgColor={qr.fg_color} bgColor={qr.bg_color} title={qr.title || qr.short_code} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Scans', value: formatNumber(qr.scan_count), color: 'text-brand-400' },
          { label: 'Countries', value: Object.keys(countryMap).length.toString(), color: 'text-purple-400' },
          { label: 'Devices', value: Object.keys(deviceMap).length.toString(), color: 'text-green-400' },
          { label: 'Last 7 Days', value: formatNumber(scans.filter((s) => new Date(s.scanned_at) > new Date(Date.now() - 7 * 86400000)).length), color: 'text-yellow-400' },
        ].map((s) => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-sm">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="space-y-6">
        <ScansOverTime data={scansByDayArray} title="Scans Over Time" />
        <div className="grid md:grid-cols-2 gap-6">
          <TopCountries data={topCountries} title="Top Countries" />
          <DeviceBreakdown data={deviceData} title="Device Breakdown" />
        </div>

        {/* Referrers Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Top Referrers</h3>
          {topReferrers.length === 0 ? (
            <p className="text-gray-500 text-sm">No referrer data yet</p>
          ) : (
            <div className="space-y-2">
              {topReferrers.map(([referrer, count]) => (
                <div key={referrer} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                  <span className="text-gray-300 text-sm truncate">{referrer}</span>
                  <span className="text-gray-400 text-sm font-mono">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Scans */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Scans</h3>
          {scans.length === 0 ? (
            <p className="text-gray-500 text-sm">No scans yet. Share your QR code to start tracking!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-800">
                    <th className="text-left py-2">Time</th>
                    <th className="text-left py-2">Country</th>
                    <th className="text-left py-2">Device</th>
                    <th className="text-left py-2">Referrer</th>
                  </tr>
                </thead>
                <tbody>
                  {scans.slice(0, 20).map((scan) => (
                    <tr key={scan.id} className="border-b border-gray-800/50">
                      <td className="py-2 text-gray-300">{new Date(scan.scanned_at).toLocaleString()}</td>
                      <td className="py-2 text-gray-300">{scan.country || '—'}</td>
                      <td className="py-2 text-gray-300">{scan.device_type || '—'}</td>
                      <td className="py-2 text-gray-400 truncate max-w-[200px]">{scan.referrer || 'Direct'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
