import React from 'react';

interface SliderInputProps {
  icon?: React.ReactNode;
  label: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

export const SliderInput: React.FC<SliderInputProps> = ({
  icon,
  label,
  value,
  onChange,
  min = 0,
  max = 200,
  step = 1,
  unit = 'px',
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseFloat(e.target.value);
    if (!isNaN(num)) {
      onChange(Math.max(min, Math.min(max, num)));
    }
  };

  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  return (
    <div className="flex flex-col gap-1.5 py-1.5 group">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-slate-300 group-hover:text-white transition-colors">
          {icon && <span className="text-purple-400 text-sm opacity-90">{icon}</span>}
          <span className="font-medium text-[13px]">{label}</span>
        </div>
        <div className="flex items-center bg-[#07152B] border border-[#12345C] rounded-md px-2 py-0.5 focus-within:border-purple-500 transition-colors">
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={handleInputChange}
            className="w-10 bg-transparent text-right text-xs font-mono text-purple-200 focus:outline-none"
          />
          <span className="text-[11px] text-slate-400 ml-0.5">{unit}</span>
        </div>
      </div>

      {/* Styled Range Slider */}
      <div className="relative flex items-center h-5 w-full">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-[#07152B] border border-[#12345C] focus:outline-none custom-slider"
          style={{
            background: `linear-gradient(to right, #8B5CF6 0%, #EC4899 ${percentage}%, #07152B ${percentage}%, #07152B 100%)`,
          }}
        />
      </div>
    </div>
  );
};
