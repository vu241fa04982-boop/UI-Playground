import React from 'react';
import { useLocation } from 'react-router-dom';
import { WaveformLogo } from '../icons';

export const Footer: React.FC = () => {
  const location = useLocation();

  // Do not show footer on authentication screens
  if (location.pathname === '/login' || location.pathname === '/signup') {
    return null;
  }

  return (
    <footer className="w-full border-t border-slate-200 dark:border-[#12345C]/60 bg-white dark:bg-[#020817] py-6 px-4 text-xs text-slate-500 dark:text-slate-400 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <WaveformLogo size={20} />
          <span className="font-bold text-slate-900 dark:text-slate-200">UI Playground</span>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <span className="text-slate-600 dark:text-slate-400">Design UI without guessing CSS</span>
        </div>

        <div className="text-slate-500 font-mono text-[11px]">
          Pure Frontend • React + TypeScript + Vite
        </div>
      </div>
    </footer>
  );
};
