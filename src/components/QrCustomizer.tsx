'use client';

interface QrCustomizerProps {
  fgColor: string;
  bgColor: string;
  onFgChange: (color: string) => void;
  onBgChange: (color: string) => void;
}

const PRESET_COLORS = [
  '#000000', '#1a1a2e', '#16213e', '#0f3460',
  '#e94560', '#533483', '#0ea5e9', '#10b981',
  '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899',
];

export default function QrCustomizer({ fgColor, bgColor, onFgChange, onBgChange }: QrCustomizerProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">Foreground Color</label>
        <div className="flex items-center gap-3 mb-3">
          <input
            type="color"
            value={fgColor}
            onChange={(e) => onFgChange(e.target.value)}
            className="w-10 h-10 rounded cursor-pointer bg-transparent border-0"
          />
          <input
            type="text"
            value={fgColor}
            onChange={(e) => onFgChange(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white font-mono w-28"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESET_COLORS.map((c) => (
            <button
              key={`fg-${c}`}
              onClick={() => onFgChange(c)}
              className={`w-7 h-7 rounded-md border-2 transition-all ${
                fgColor === c ? 'border-brand-400 scale-110' : 'border-gray-600 hover:border-gray-400'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">Background Color</label>
        <div className="flex items-center gap-3 mb-3">
          <input
            type="color"
            value={bgColor}
            onChange={(e) => onBgChange(e.target.value)}
            className="w-10 h-10 rounded cursor-pointer bg-transparent border-0"
          />
          <input
            type="text"
            value={bgColor}
            onChange={(e) => onBgChange(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white font-mono w-28"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {['#FFFFFF', '#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1', '#94a3b8'].map((c) => (
            <button
              key={`bg-${c}`}
              onClick={() => onBgChange(c)}
              className={`w-7 h-7 rounded-md border-2 transition-all ${
                bgColor === c ? 'border-brand-400 scale-110' : 'border-gray-600 hover:border-gray-400'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
