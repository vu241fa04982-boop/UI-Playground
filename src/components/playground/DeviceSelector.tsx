import React from 'react';
import { usePlayground } from '../../context/PlaygroundContext';
import { DesktopIcon, TabletIcon, MobileIcon } from '../icons';
import { DeviceType } from '../../types/playground';

export const DeviceSelector: React.FC = () => {
  const { device, setDevice } = usePlayground();

  const devices: { id: DeviceType; label: string; icon: React.ReactNode }[] = [
    { id: 'desktop', label: 'Desktop', icon: <DesktopIcon size={16} /> },
    { id: 'tablet', label: 'Tablet', icon: <TabletIcon size={16} /> },
    { id: 'mobile', label: 'Mobile', icon: <MobileIcon size={16} /> },
  ];

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-[#12345C]/70 bg-slate-50 dark:bg-[#07152B]/80 transition-colors">
      {/* Device buttons container */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-[#020817] border border-slate-200 dark:border-[#12345C]/60">
        {devices.map((d) => {
          const isActive = device === d.id;
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => setDevice(d.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[#7C3AED] text-white shadow-[0_0_12px_rgba(124,58,237,0.5)]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800/50'
              }`}
            >
              {d.icon}
              <span>{d.label}</span>
            </button>
          );
        })}
      </div>

      {/* Live Preview Indicator */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_#10B981]" />
        </span>
        <span className="font-medium">Live Preview</span>
      </div>
    </div>
  );
};
