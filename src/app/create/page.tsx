'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import QrGenerator from '@/components/QrGenerator';
import QrCustomizer from '@/components/QrCustomizer';
import QrDownload from '@/components/QrDownload';
import { isValidUrl, getBaseUrl, getAnonymousToken } from '@/lib/utils';

export default function CreatePage() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [created, setCreated] = useState<{ short_code: string; id: string } | null>(null);

  const redirectUrl = created ? `${getBaseUrl()}/r/${created.short_code}` : '';

  const handleCreate = async () => {
    if (!url) {
      setError('Please enter a URL');
      return;
    }
    if (!isValidUrl(url)) {
      setError('Please enter a valid URL (https://...)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination_url: url,
          title: title || undefined,
          fg_color: fgColor,
          bg_color: bgColor,
          anonymous_token: getAnonymousToken(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create QR code');
      }

      const data = await res.json();
      setCreated(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Create QR Code</h1>
        <p className="text-gray-400 mt-2">Generate a dynamic QR code with custom styling</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Left: Form */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Destination URL *</label>
            <input
              type="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError('');
              }}
              placeholder="https://example.com"
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Title (optional)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My QR Code"
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>

          <QrCustomizer
            fgColor={fgColor}
            bgColor={bgColor}
            onFgChange={setFgColor}
            onBgChange={setBgColor}
          />

          {error && (
            <div className="bg-red-900/20 border border-red-800 rounded-xl px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          {!created ? (
            <button
              onClick={handleCreate}
              disabled={loading}
              className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-brand-800 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-medium text-lg transition-colors"
            >
              {loading ? 'Creating...' : 'Create QR Code'}
            </button>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-900/20 border border-green-800 rounded-xl px-4 py-3 text-green-400 text-sm">
                ✅ QR code created! Share the redirect URL below.
              </div>
              <div className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-3">
                <label className="block text-xs text-gray-500 mb-1">Redirect URL</label>
                <div className="flex items-center gap-2">
                  <code className="text-brand-400 text-sm flex-1 break-all">{redirectUrl}</code>
                  <button
                    onClick={() => navigator.clipboard.writeText(redirectUrl)}
                    className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
                  >
                    Copy
                  </button>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => router.push(`/qr/${created.id}`)}
                  className="flex-1 bg-brand-600/20 text-brand-400 hover:bg-brand-600/30 py-2.5 rounded-xl font-medium transition-colors"
                >
                  View Analytics
                </button>
                <button
                  onClick={() => {
                    setCreated(null);
                    setUrl('');
                    setTitle('');
                  }}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2.5 rounded-xl font-medium transition-colors"
                >
                  Create Another
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Preview */}
        <div className="flex flex-col items-center gap-8">
          <div className="sticky top-24">
            <QrGenerator
              url={created ? redirectUrl : url || 'https://qrtrace.app'}
              fgColor={fgColor}
              bgColor={bgColor}
              size={280}
            />
            {created && (
              <div className="mt-6">
                <QrDownload
                  url={redirectUrl}
                  fgColor={fgColor}
                  bgColor={bgColor}
                  title={title}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
