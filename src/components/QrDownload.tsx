'use client';

import QRCode from 'qrcode';

interface QrDownloadProps {
  url: string;
  fgColor: string;
  bgColor: string;
  title?: string;
}

export default function QrDownload({ url, fgColor, bgColor, title }: QrDownloadProps) {
  const filename = title ? title.replace(/\s+/g, '-').toLowerCase() : 'qrcode';

  const downloadPng = async (size: number) => {
    const canvas = document.createElement('canvas');
    await QRCode.toCanvas(canvas, url, {
      width: size,
      margin: 2,
      color: { dark: fgColor, light: bgColor },
      errorCorrectionLevel: 'M',
    });
    const link = document.createElement('a');
    link.download = `${filename}-${size}px.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const downloadSvg = async () => {
    const svg = await QRCode.toString(url, {
      type: 'svg',
      margin: 2,
      color: { dark: fgColor, light: bgColor },
      errorCorrectionLevel: 'M',
    });
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const link = document.createElement('a');
    link.download = `${filename}.svg`;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  };

  if (!url) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-300">Download</h3>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => downloadPng(256)}
          className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 transition-colors"
        >
          PNG 256px
        </button>
        <button
          onClick={() => downloadPng(512)}
          className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 transition-colors"
        >
          PNG 512px
        </button>
        <button
          onClick={() => downloadPng(1024)}
          className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 transition-colors"
        >
          PNG 1024px
        </button>
        <button
          onClick={downloadSvg}
          className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 transition-colors"
        >
          SVG
        </button>
      </div>
    </div>
  );
}
