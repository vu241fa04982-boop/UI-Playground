import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { WaveformLogo, ArrowRightIcon, SparklesIcon, BookmarkIcon } from '../components/icons';

export const HomePage: React.FC = () => {
  // Interactive mini playground showcase on homepage
  const [heroRadius, setHeroRadius] = useState(24);
  const [heroBg, setHeroBg] = useState('#0B1D3A');
  const [heroPadding, setHeroPadding] = useState(28);

  const steps = [
    {
      num: '01',
      title: 'Choose a component',
      desc: 'Select from over 25+ production-grade elements including cards, buttons, navbars, modals, and pricing tiers.',
    },
    {
      num: '02',
      title: 'Customize its properties',
      desc: 'Fine-tune border radiuses, multi-stop gradients, typographic scales, subtle neon shadows, and fluid animations.',
    },
    {
      num: '03',
      title: 'See changes instantly',
      desc: 'Simulate desktop, tablet, and mobile viewpoints with zero page refreshes or lag.',
    },
    {
      num: '04',
      title: 'Copy or save your CSS',
      desc: 'One-click copy production-clean CSS, SCSS, or Tailwind arbitrary classes, and store designs in your local library.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020817] text-slate-900 dark:text-slate-100 selection:bg-purple-600 selection:text-white transition-colors duration-200">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-purple-700/20 via-pink-600/15 to-cyan-500/10 blur-[130px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100/90 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-500/40 text-xs font-semibold text-purple-700 dark:text-purple-300 shadow-[0_0_15px_rgba(124,58,237,0.15)] dark:shadow-[0_0_15px_rgba(124,58,237,0.3)] animate-fade-in">
            <SparklesIcon size={14} className="text-cyan-500 dark:text-cyan-400" />
            <span>Interactive CSS Generator & Design Studio</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Design UI without{' '}
            <span className="hero-gradient-text bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 dark:from-purple-400 dark:via-fuchsia-400 dark:to-pink-500 bg-clip-text text-transparent">
              guessing CSS.
            </span>
          </h1>

          <p className="text-lg sm:text-xl font-medium text-slate-700 dark:text-slate-200 max-w-2xl mx-auto leading-relaxed">
            Design, customize and generate CSS in real time.
          </p>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Visually experiment with UI properties, instantly preview changes across responsive devices, generate production-ready CSS, SCSS, or Tailwind, and save your designs.
          </p>

          {/* Action Buttons: Hero "Start Playground" is the ONLY primary CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/playground"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold text-sm shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Start Playground</span>
              <ArrowRightIcon size={16} />
            </Link>

            <Link
              to="/saved"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white dark:bg-[#07152B] border border-slate-300 dark:border-[#12345C] hover:border-purple-400 dark:hover:border-slate-500 text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white font-semibold text-sm shadow-sm dark:shadow-md transition-all hover:bg-slate-50 dark:hover:bg-[#0B1D3A] flex items-center justify-center gap-2"
            >
              <BookmarkIcon size={16} className="text-purple-600 dark:text-purple-400" />
              <span>View Saved Designs</span>
            </Link>
          </div>
        </div>

        {/* Informational Interactive Live Showcase Widget (NO duplicate Get Started button) */}
        <div className="max-w-4xl mx-auto mt-16 p-6 rounded-3xl bg-white/95 dark:bg-[#0B1D3A]/90 border border-slate-200 dark:border-[#12345C] shadow-xl dark:shadow-[0_20px_70px_rgba(0,0,0,0.8)] relative z-10 backdrop-blur-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-[#12345C]/60 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-mono text-slate-500 dark:text-slate-400">interactive-preview.css</span>
            </div>

            {/* Quick interactive controls right on the hero preview */}
            <div className="flex flex-wrap items-center gap-4 text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <span>Radius:</span>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={heroRadius}
                  onChange={(e) => setHeroRadius(Number(e.target.value))}
                  className="w-24 accent-purple-500 cursor-pointer"
                />
                <span className="font-mono text-purple-700 dark:text-purple-300">{heroRadius}px</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Color:</span>
                <button
                  type="button"
                  onClick={() => setHeroBg('#0B1D3A')}
                  className={`w-4 h-4 rounded-full bg-[#0B1D3A] border ${heroBg === '#0B1D3A' ? 'border-purple-400 scale-125' : 'border-slate-600'}`}
                  aria-label="Color Navy"
                />
                <button
                  type="button"
                  onClick={() => setHeroBg('#1E1B4B')}
                  className={`w-4 h-4 rounded-full bg-[#1E1B4B] border ${heroBg === '#1E1B4B' ? 'border-purple-400 scale-125' : 'border-slate-600'}`}
                  aria-label="Color Indigo"
                />
                <button
                  type="button"
                  onClick={() => setHeroBg('#0F172A')}
                  className={`w-4 h-4 rounded-full bg-[#0F172A] border ${heroBg === '#0F172A' ? 'border-purple-400 scale-125' : 'border-slate-600'}`}
                  aria-label="Color Slate"
                />
              </div>
            </div>
          </div>

          {/* Render the interactive preview card without duplicate Get Started button */}
          <div className="py-8 flex justify-center">
            <div
              style={{
                borderRadius: `${heroRadius}px`,
                backgroundColor: heroBg,
                padding: `${heroPadding}px`,
              }}
              className="w-full max-w-xl border border-slate-300 dark:border-[#12345C] shadow-lg dark:shadow-[0_15px_40px_rgba(0,0,0,0.5)] transition-all duration-300 flex flex-col md:flex-row items-center justify-between gap-6"
            >
              <div className="space-y-3 flex-1 text-left">
                <WaveformLogo size={32} />
                <h3 className="text-xl sm:text-2xl font-bold text-white keep-white tracking-tight">
                  Create Something Beautiful
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 keep-white leading-relaxed max-w-sm">
                  A simple and powerful way to turn your ideas into stunning user interfaces.
                </p>
                <div className="flex items-center gap-2 pt-1 text-xs text-purple-300 keep-white font-medium">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span>Real-time CSS rendered live</span>
                </div>
              </div>

              {/* Decorative Swirl */}
              <div className="w-36 h-36 relative flex-shrink-0 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-purple-600/30 blur-xl animate-pulse" />
                <svg viewBox="0 0 100 100" className="w-full h-full relative z-10 animate-spin" style={{ animationDuration: '18s' }}>
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#8B5CF6" strokeWidth="4" strokeDasharray="120 40" />
                  <circle cx="50" cy="50" r="24" fill="none" stroke="#EC4899" strokeWidth="4" strokeDasharray="80 20" />
                  <circle cx="50" cy="50" r="12" fill="#22D3EE" opacity="0.8" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-[#12345C]/50 bg-slate-100/60 dark:bg-[#07152B]/40">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">Streamlined Workflow</span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">How It Works</h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              From visual exploration to clean frontend code in 4 easy steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div
                key={step.num}
                className="p-6 rounded-2xl bg-white dark:bg-[#0B1D3A] border border-slate-200 dark:border-[#12345C] hover:border-purple-400 dark:hover:border-purple-500/50 transition-all hover:-translate-y-1 shadow-sm dark:shadow-lg space-y-3 relative group"
              >
                <div className="text-2xl font-black text-purple-600/70 dark:text-purple-500/60 font-mono group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">
                  {step.num}
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{step.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
