import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { SunIcon, MoonIcon } from '../icons';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', showLabel = false }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`flex items-center justify-center gap-2 p-2 rounded-xl transition-all duration-200 ${
        theme === 'dark'
          ? 'bg-[#07152B] border border-[#12345C] text-amber-300 hover:text-amber-200 hover:border-amber-400/50 hover:bg-[#0B1D3A]'
          : 'bg-white border border-slate-300 text-purple-700 hover:text-purple-800 hover:border-purple-400 hover:bg-slate-50 shadow-sm'
      } ${className}`}
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {theme === 'dark' ? (
        <SunIcon size={17} className="transition-transform hover:rotate-45" />
      ) : (
        <MoonIcon size={17} className="transition-transform hover:-rotate-12" />
      )}
      {showLabel && (
        <span className="text-xs font-semibold">
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </span>
      )}
    </button>
  );
};
