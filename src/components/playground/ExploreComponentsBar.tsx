import React from 'react';
import { usePlayground } from '../../context/PlaygroundContext';
import { CardIcon, ButtonIcon, InputIcon } from '../icons';
import { ComponentType } from '../../types/playground';

export const ExploreComponentsBar: React.FC = () => {
  const { selectedComponent, selectComponent } = usePlayground();

  const cards: { type: ComponentType; title: string; subtitle: string; icon: React.ReactNode }[] = [
    {
      type: 'card',
      title: 'Card',
      subtitle: 'Content card with custom styles',
      icon: <CardIcon size={20} />,
    },
    {
      type: 'button',
      title: 'Button',
      subtitle: 'Interactive button with hover effects',
      icon: <ButtonIcon size={20} />,
    },
    {
      type: 'input',
      title: 'Input',
      subtitle: 'Form input field with focus styles',
      icon: <InputIcon size={20} />,
    },
  ];

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1D3A] border border-slate-200 dark:border-[#12345C] shadow-sm dark:shadow-xl transition-colors">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">Explore Components</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Choose a component to customize</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        {cards.map((card) => {
          const isActive = selectedComponent === card.type;
          return (
            <button
              key={card.type}
              type="button"
              onClick={() => selectComponent(card.type)}
              className={`p-4 rounded-xl border text-left flex items-start gap-3.5 transition-all ${
                isActive
                  ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500 shadow-[0_0_20px_rgba(124,58,237,0.15)] dark:shadow-[0_0_20px_rgba(124,58,237,0.35)] ring-1 ring-purple-500'
                  : 'bg-slate-50 dark:bg-[#07152B]/60 border-slate-200 dark:border-[#12345C] hover:border-purple-400 dark:hover:border-slate-500 hover:bg-slate-100 dark:hover:bg-[#07152B]'
              }`}
            >
              <div
                className={`p-2.5 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                  isActive ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-200 dark:bg-[#0B1D3A] text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-[#12345C]'
                }`}
              >
                {card.icon}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-0.5">{card.title}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">{card.subtitle}</p>
              </div>
            </button>
          );
        })}

        {/* Right side decorative neon wave banner matching reference image */}
        <div className="relative p-4 rounded-xl bg-gradient-to-r from-slate-100 to-purple-50/60 dark:from-[#07152B] dark:to-[#0A1B38] border border-slate-200 dark:border-[#12345C] overflow-hidden flex items-center justify-between">
          {/* Neon wave graphic */}
          <div className="absolute right-0 top-0 bottom-0 w-36 pointer-events-none opacity-80">
            <svg viewBox="0 0 200 100" preserveAspectRatio="none" className="w-full h-full">
              <path
                d="M0,50 C40,20 80,80 120,30 C160,-20 180,90 200,50"
                fill="none"
                stroke="url(#neonRibbon)"
                strokeWidth="4"
              />
              <path
                d="M0,55 C40,85 80,15 120,65 C160,115 180,25 200,55"
                fill="none"
                stroke="#22D3EE"
                strokeWidth="2"
                opacity="0.7"
              />
              <defs>
                <linearGradient id="neonRibbon" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#22D3EE" />
                  <stop offset="50%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="relative z-10 max-w-[200px]">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">Your ideas. Your style.</h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-snug">
              Experiment with different styles and create beautiful UI components.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
