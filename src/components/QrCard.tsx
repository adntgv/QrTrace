'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import type { QrCode } from '@/lib/types';
import { formatNumber, formatDate, getBaseUrl } from '@/lib/utils';

interface QrCardProps {
  qr: QrCode;
  onToggle: (id: string, active: boolean) => void;
  onDelete: (id: string) => void;
}

export default function QrCard({ qr, onToggle, onDelete }: QrCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const redirectUrl = `${getBaseUrl()}/r/${qr.short_code}`;

  useEffect(() => {
    if (!canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, redirectUrl, {
      width: 80,
      margin: 1,
      color: {
        dark: qr.fg_color || '#000000',
        light: qr.bg_color || '#FFFFFF',
      },
    }).catch(() => {});
  }, [redirectUrl, qr.fg_color, qr.bg_color]);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <canvas ref={canvasRef} className="rounded-lg" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <Link href={`/qr/${qr.id}`} className="text-white font-medium hover:text-brand-400 transition-colors truncate block">
                {qr.title || qr.short_code}
              </Link>
              <p className="text-gray-400 text-sm truncate mt-0.5">{qr.destination_url}</p>
            </div>
            <span
              className={`flex-shrink-0 text-xs px-2 py-1 rounded-full ${
                qr.is_active ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
              }`}
            >
              {qr.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>

          <div className="flex items-center gap-4 mt-3">
            <div className="text-sm">
              <span className="text-gray-500">Scans: </span>
              <span className="text-white font-medium">{formatNumber(qr.scan_count)}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-500">Created: </span>
              <span className="text-gray-300">{formatDate(qr.created_at)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <Link
              href={`/qr/${qr.id}`}
              className="text-xs bg-brand-600/20 text-brand-400 hover:bg-brand-600/30 px-3 py-1.5 rounded-lg transition-colors"
            >
              Analytics
            </Link>
            <button
              onClick={() => onToggle(qr.id, !qr.is_active)}
              className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg transition-colors"
            >
              {qr.is_active ? 'Deactivate' : 'Activate'}
            </button>
            <button
              onClick={() => {
                if (confirm('Delete this QR code?')) onDelete(qr.id);
              }}
              className="text-xs bg-red-900/20 text-red-400 hover:bg-red-900/30 px-3 py-1.5 rounded-lg transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
