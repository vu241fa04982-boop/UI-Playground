import React, { useRef } from 'react';

interface ColorPickerProps {
  icon?: React.ReactNode;
  label: string;
  value: string;
  onChange: (color: string) => void;
  showPresets?: boolean;
}

const PRESET_COLORS = [
  '#0B1D3A', '#020817', '#07152B', '#12345C',
  '#7C3AED', '#8B5CF6', '#EC4899', '#2563EB',
  '#22D3EE', '#10B981', '#F59E0B', '#EF4444',
  '#F8FAFC', '#E2E8F0', '#94A3B8', '#000000',
];

export const ColorPicker: React.FC<ColorPickerProps> = ({
  icon,
  label,
  value,
  onChange,
  showPresets = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCircleClick = () => {
    inputRef.current?.click();
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="flex flex-col gap-1.5 py-1.5 group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-300 group-hover:text-white transition-colors">
          {icon && <span className="text-purple-400 text-sm opacity-90">{icon}</span>}
          <span className="font-medium text-[13px]">{label}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Circular swatch button */}
          <button
            type="button"
            onClick={handleCircleClick}
            className="w-6 h-6 rounded-full border border-slate-600 shadow-sm transition-transform hover:scale-110 relative overflow-hidden flex-shrink-0"
            style={{ backgroundColor: value }}
            title="Click to pick color"
          >
            <input
              ref={inputRef}
              type="color"
              value={value.startsWith('#') && value.length === 7 ? value : '#0B1D3A'}
              onChange={(e) => onChange(e.target.value)}
              className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
            />
          </button>

          {/* Hex Pill text box matching reference image */}
          <div className="bg-[#07152B] border border-[#12345C] rounded-md px-2 py-0.5 focus-within:border-purple-500 transition-colors">
            <input
              type="text"
              value={value}
              onChange={handleHexChange}
              className="w-20 bg-transparent text-xs font-mono text-slate-200 uppercase focus:outline-none"
              placeholder="#000000"
            />
          </div>
        </div>
      </div>

      {showPresets && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {PRESET_COLORS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => onChange(preset)}
              className={`w-4 h-4 rounded-full border transition-all ${
                value.toLowerCase() === preset.toLowerCase()
                  ? 'border-purple-400 scale-125 shadow-[0_0_8px_rgba(139,92,246,0.6)]'
                  : 'border-slate-700 hover:scale-110'
              }`}
              style={{ backgroundColor: preset }}
              title={preset}
            />
          ))}
        </div>
      )}
    </div>
  );
};
