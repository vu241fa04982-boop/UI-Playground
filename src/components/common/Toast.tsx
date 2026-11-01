import React from 'react';
import { usePlayground } from '../../context/PlaygroundContext';
import { CheckIcon, SparklesIcon, CloseIcon } from '../icons';

export const Toast: React.FC = () => {
  const { toast, closeToast } = usePlayground();

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-[#0B1D3A]/95 backdrop-blur-md border border-purple-500/50 shadow-[0_10px_30px_rgba(124,58,237,0.3)] text-white text-sm animate-fade-in">
      <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white flex-shrink-0 shadow-sm">
        {toast.type === 'success' ? <CheckIcon size={16} /> : <SparklesIcon size={16} />}
      </div>
      <p className="font-medium text-slate-100 pr-2">{toast.message}</p>
      <button
        onClick={closeToast}
        className="text-slate-400 hover:text-white transition-colors p-1"
        aria-label="Close notification"
      >
        <CloseIcon size={14} />
      </button>
    </div>
  );
};
