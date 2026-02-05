'use client';

import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

interface QrGeneratorProps {
  url: string;
  fgColor: string;
  bgColor: string;
  size?: number;
}

export default function QrGenerator({ url, fgColor, bgColor, size = 256 }: QrGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!canvasRef.current || !url) return;
    setError(false);

    QRCode.toCanvas(canvasRef.current, url, {
      width: size,
      margin: 2,
      color: {
        dark: fgColor,
        light: bgColor,
      },
      errorCorrectionLevel: 'M',
    }).catch(() => setError(true));
  }, [url, fgColor, bgColor, size]);

  if (!url) {
    return (
      <div
        className="flex items-center justify-center bg-gray-800 rounded-xl border-2 border-dashed border-gray-600"
        style={{ width: size, height: size }}
      >
        <p className="text-gray-500 text-sm text-center px-4">Enter a URL to generate QR code</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex items-center justify-center bg-red-950/20 rounded-xl border border-red-800"
        style={{ width: size, height: size }}
      >
        <p className="text-red-400 text-sm">Failed to generate QR</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden shadow-xl" style={{ width: size, height: size }}>
      <canvas ref={canvasRef} />
    </div>
  );
}
