import React, { useState } from 'react';
import { ComponentSettings, ComponentType, DeviceType } from '../../types/playground';
import { WaveformLogo, CheckIcon, ArrowRightIcon, SparklesIcon } from '../icons';
import { ANIMATION_PRESETS } from '../../data/animationPresets';

interface ComponentRendererProps {
  type: ComponentType;
  settings: ComponentSettings;
  device?: DeviceType;
}

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({ type, settings, device = 'desktop' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [toggleOn, setToggleOn] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  // Compute background
  const getBackground = () => {
    if (isHovered && settings.hover.enabled && settings.hover.bgColor) {
      return settings.hover.bgColor;
    }
    if (settings.color.bgType === 'linear-gradient') {
      return `linear-gradient(${settings.color.gradientDirection}, ${settings.color.gradientColor1}, ${settings.color.gradientColor2})`;
    }
    if (settings.color.bgType === 'radial-gradient') {
      return `radial-gradient(circle, ${settings.color.gradientColor1}, ${settings.color.gradientColor2})`;
    }
    return settings.color.bgColor;
  };

  // Compute border radius
  const getBorderRadius = () => {
    if (settings.border.linkedCorners) {
      return `${settings.border.radius}px`;
    }
    return `${settings.border.topLeft}px ${settings.border.topRight}px ${settings.border.bottomRight}px ${settings.border.bottomLeft}px`;
  };

  // Compute transform (preserves rotation, scale, translates, skews without being overwritten by keyframe animations)
  const getTransform = () => {
    const t = settings.transform;
    let base = `translate(${t.translateX}px, ${t.translateY}px) scale(${t.scale}) rotate(${t.rotate}deg) skew(${t.skewX}deg, ${t.skewY}deg)`;
    if (isHovered && settings.hover.enabled) {
      if (settings.hover.translateY) {
        base += ` translateY(${settings.hover.translateY}px)`;
      }
      if (settings.hover.scale !== 1) {
        base += ` scale(${settings.hover.scale})`;
      }
      if (settings.hover.rotate) {
        base += ` rotate(${settings.hover.rotate}deg)`;
      }
    }
    return base;
  };

  // Compute box shadow
  const getBoxShadow = () => {
    if (isHovered && settings.hover.enabled && settings.hover.shadowBlur > 0) {
      return `0 12px ${settings.hover.shadowBlur}px ${settings.hover.shadowColor}`;
    }
    const s = settings.shadow;
    const inset = s.inset ? 'inset ' : '';
    return `${inset}${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${s.color}`;
  };

  // Compute keyframe animation shorthand for the inner component
  const getAnimationStyle = (): string | undefined => {
    const anim = settings.animation;
    if (!anim || !anim.preset || anim.preset === 'none') return undefined;
    const presetData = ANIMATION_PRESETS[anim.preset];
    const keyframesName = presetData ? presetData.keyframesName : anim.preset;
    const fill = anim.fillMode || 'both';
    return `${keyframesName} ${anim.duration}ms ${anim.timingFunction} ${anim.delay}ms ${anim.iterationCount} ${anim.direction} ${fill}`;
  };

  // Outer wrapper container holds user transforms and hover transforms
  // so that keyframe animations on the inner element NEVER overwrite them!
  const wrapperStyle: React.CSSProperties = {
    transform: getTransform(),
    transformOrigin: 'center center',
    margin: `${settings.layout.margin}px`,
    position: settings.layout.position,
    display: settings.layout.display.includes('flex') ? settings.layout.display : 'inline-flex',
    width: settings.layout.width,
    maxWidth: settings.layout.maxWidth,
    minWidth: settings.layout.minWidth,
    boxSizing: 'border-box',
    transition: `${settings.transition.property} ${settings.transition.duration}ms ${settings.transition.timingFunction}`,
  };

  // Inner styled object for the component visual properties + keyframe animation
  const innerStyle: React.CSSProperties = {
    background: getBackground(),
    borderRadius: getBorderRadius(),
    borderWidth: `${settings.border.width}px`,
    borderStyle: settings.border.style,
    borderColor: isHovered && settings.hover.enabled && settings.hover.borderColor ? settings.hover.borderColor : settings.border.color,
    padding: `${settings.layout.padding}px`,
    color: isHovered && settings.hover.enabled && settings.hover.textColor ? settings.hover.textColor : settings.color.textColor,
    fontFamily: settings.typography.fontFamily,
    fontSize: `${settings.typography.fontSize}px`,
    fontWeight: settings.typography.fontWeight as any,
    lineHeight: settings.typography.lineHeight,
    letterSpacing: `${settings.typography.letterSpacing}px`,
    textAlign: settings.typography.textAlign,
    textTransform: settings.typography.textTransform !== 'none' ? settings.typography.textTransform : undefined,
    textDecoration: settings.typography.textDecoration !== 'none' ? settings.typography.textDecoration : undefined,
    boxShadow: getBoxShadow(),
    boxSizing: 'border-box',
    opacity: settings.color.opacity / 100,
    gap: `${settings.layout.gap}px`,
    display: settings.layout.display,
    flexDirection: settings.layout.flexDirection,
    justifyContent: settings.layout.justifyContent,
    alignItems: settings.layout.alignItems,
    animation: getAnimationStyle(),
    width: '100%',
    height: settings.layout.height !== 'auto' ? settings.layout.height : undefined,
    maxHeight: settings.layout.maxHeight !== 'none' ? settings.layout.maxHeight : undefined,
    minHeight: settings.layout.minHeight !== 'auto' ? settings.layout.minHeight : undefined,
  };

  // Neon glowing sphere mesh illustration matching the reference image Card
  const NeonSphereIllustration = () => (
    <div className="relative w-44 h-44 flex-shrink-0 flex items-center justify-center pointer-events-none">
      {/* Background ambient neon bloom */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-600/40 via-purple-600/50 to-pink-500/50 blur-2xl animate-pulse" />
      {/* Abstract fluid swirling neon SVG */}
      <svg viewBox="0 0 200 200" className="w-full h-full relative z-10 filter drop-shadow-[0_0_20px_rgba(236,72,153,0.7)]">
        <defs>
          <radialGradient id="neonCenter" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="25%" stopColor="#22D3EE" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#8B5CF6" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#EC4899" stopOpacity="0.9" />
          </radialGradient>
          <linearGradient id="orbitGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#F43F5E" />
          </linearGradient>
          <linearGradient id="orbitGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#EC4899" />
            <stop offset="50%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
        {/* Intricate swirling 3D ribbon loops */}
        <circle cx="100" cy="100" r="30" fill="url(#neonCenter)" opacity="0.6" className="animate-ping" style={{ animationDuration: '3s' }} />
        <path
          d="M 40,100 C 40,60 70,40 100,40 C 140,40 160,70 160,100 C 160,140 130,160 100,160 C 60,160 40,130 40,100 Z"
          fill="none"
          stroke="url(#orbitGrad1)"
          strokeWidth="6"
          strokeDasharray="180 30"
          className="animate-spin"
          style={{ animationDuration: '14s', transformOrigin: 'center' }}
        />
        <path
          d="M 55,80 C 40,120 70,150 110,150 C 150,150 165,110 145,70 C 125,30 70,40 55,80 Z"
          fill="none"
          stroke="url(#orbitGrad2)"
          strokeWidth="5"
          opacity="0.9"
          className="animate-spin"
          style={{ animationDuration: '9s', animationDirection: 'reverse', transformOrigin: 'center' }}
        />
        <path
          d="M 65,110 C 80,60 130,65 140,100 C 150,135 110,155 85,135 C 60,115 65,110 65,110 Z"
          fill="none"
          stroke="#22D3EE"
          strokeWidth="3.5"
          opacity="0.85"
        />
        {/* Sparkling star particles */}
        <circle cx="145" cy="55" r="2.5" fill="#FFFFFF" />
        <circle cx="70" cy="140" r="2" fill="#F43F5E" />
        <circle cx="150" cy="130" r="2" fill="#38BDF8" />
      </svg>
    </div>
  );

  return (
    <div
      style={wrapperStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative cursor-pointer select-none"
    >
      <div style={innerStyle} className="w-full relative transition-colors">
        {/* 1. CARD Component - matching reference image faithfully */}
      {type === 'card' && (
        <div className={`flex ${device === 'mobile' ? 'flex-col items-center text-center' : 'flex-col md:flex-row items-center justify-between'} gap-6 w-full`}>
          <div className={`flex-1 space-y-3 ${device === 'mobile' ? 'text-center' : 'text-left'}`}>
            <div className={device === 'mobile' ? 'flex justify-center' : ''}>
              <WaveformLogo size={device === 'mobile' ? 26 : 32} />
            </div>
            <h3 className={`${device === 'mobile' ? 'text-lg' : 'text-xl md:text-2xl'} font-bold text-white tracking-tight leading-snug`}>
              {settings.content.heading || 'Create Something Beautiful'}
            </h3>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-normal opacity-90 max-w-sm mx-auto md:mx-0">
              {settings.content.description ||
                'A simple and powerful way to turn your ideas into stunning user interfaces.'}
            </p>
            <div className={`pt-2 ${device === 'mobile' ? 'flex justify-center' : ''}`}>
              <button
                type="button"
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-500 text-white text-xs md:text-sm font-semibold shadow-[0_0_20px_rgba(124,58,237,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <span>{settings.content.buttonText || 'Get Started →'}</span>
              </button>
            </div>
          </div>
          <div className={device === 'mobile' ? 'scale-75 origin-center -my-3' : ''}>
            <NeonSphereIllustration />
          </div>
        </div>
      )}

      {/* 2. BUTTON Component */}
      {type === 'button' && (
        <div className="flex items-center justify-center gap-2">
          <span>{settings.content.buttonText || 'Click Here'}</span>
          <ArrowRightIcon size={16} />
        </div>
      )}

      {/* 3. INPUT Component */}
      {type === 'input' && (
        <div className="w-full flex items-center gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={settings.content.placeholder || 'Type something here...'}
            className="w-full bg-transparent text-inherit placeholder-slate-500 outline-none"
          />
          <SparklesIcon size={18} className="text-purple-400 flex-shrink-0" />
        </div>
      )}

      {/* 4. TEXTAREA Component */}
      {type === 'textarea' && (
        <textarea
          rows={3}
          placeholder={settings.content.placeholder || 'Write your message...'}
          className="w-full bg-transparent text-inherit placeholder-slate-500 outline-none resize-none"
        />
      )}

      {/* 5. SELECT Component */}
      {type === 'select' && (
        <select className="w-full bg-transparent text-inherit outline-none cursor-pointer">
          <option value="1" className="bg-[#0B1D3A] text-slate-100">Option 1 - Dark Theme</option>
          <option value="2" className="bg-[#0B1D3A] text-slate-100">Option 2 - Neon Palette</option>
          <option value="3" className="bg-[#0B1D3A] text-slate-100">Option 3 - Developer Tools</option>
        </select>
      )}

      {/* 6. CHECKBOX Component */}
      {type === 'checkbox' && (
        <div
          onClick={() => setIsChecked(!isChecked)}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div
            className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
              isChecked
                ? 'bg-purple-600 border-purple-500 text-white'
                : 'border-slate-500 bg-slate-800'
            }`}
          >
            {isChecked && <CheckIcon size={14} />}
          </div>
          <span className="text-sm font-medium">{settings.content.label || 'Accept terms and conditions'}</span>
        </div>
      )}

      {/* 7. RADIO Component */}
      {type === 'radio' && (
        <div
          onClick={() => setIsChecked(!isChecked)}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div
            className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
              isChecked ? 'border-purple-500' : 'border-slate-500'
            }`}
          >
            {isChecked && <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />}
          </div>
          <span className="text-sm font-medium">{settings.content.label || 'Select this option'}</span>
        </div>
      )}

      {/* 8. TOGGLE SWITCH */}
      {type === 'toggle' && (
        <div
          onClick={() => setToggleOn(!toggleOn)}
          className="flex items-center justify-between w-full cursor-pointer"
        >
          <span className="text-sm font-medium">{settings.content.label || 'Live Syncing'}</span>
          <div
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
              toggleOn ? 'bg-gradient-to-r from-purple-600 to-pink-500' : 'bg-slate-700'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                toggleOn ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </div>
        </div>
      )}

      {/* 9. NAVBAR Component */}
      {type === 'navbar' && (
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 font-bold text-sm">
            <WaveformLogo size={22} />
            <span>UI Playground</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium opacity-80">
            <span className="text-purple-300">Overview</span>
            <span>Components</span>
            <span>Settings</span>
          </div>
        </div>
      )}

      {/* 10. BADGE Component */}
      {type === 'badge' && (
        <div className="flex items-center gap-1.5 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
          <span>{settings.content.badgeText || 'PRO FEATURE'}</span>
        </div>
      )}

      {/* 11. ALERT Component */}
      {type === 'alert' && (
        <div className="flex items-start gap-3 w-full">
          <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0">
            <SparklesIcon size={14} />
          </div>
          <div>
            <div className="font-semibold text-sm">{settings.content.heading || 'Update Available'}</div>
            <div className="text-xs opacity-80">{settings.content.description || 'Version 2.0 has been deployed with responsive preview modes.'}</div>
          </div>
        </div>
      )}

      {/* 12. MODAL Component */}
      {type === 'modal' && (
        <div className="w-full space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700/50 pb-2">
            <h4 className="font-bold text-sm">{settings.content.heading || 'Confirm Action'}</h4>
            <span className="text-slate-400 text-xs">✕</span>
          </div>
          <p className="text-xs opacity-80">
            {settings.content.description || 'Are you sure you want to export these custom styles to your repository?'}
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <button className="px-3 py-1 text-xs rounded bg-slate-800 text-slate-300">Cancel</button>
            <button className="px-3 py-1 text-xs rounded bg-purple-600 text-white">{settings.content.buttonText || 'Confirm'}</button>
          </div>
        </div>
      )}

      {/* 13. TOOLTIP Component */}
      {type === 'tooltip' && (
        <div className="relative text-xs font-medium py-1 px-3">
          <span>{settings.content.description || 'Visual CSS Generator Engine'}</span>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-inherit transform rotate-45" />
        </div>
      )}

      {/* 14. DROPDOWN Component */}
      {type === 'dropdown' && (
        <div className="w-full space-y-1 text-xs">
          <div className="p-2 rounded bg-purple-600/30 text-purple-200 font-medium">Export as React Component</div>
          <div className="p-2 rounded hover:bg-slate-800 opacity-80">Copy SCSS Stylesheet</div>
          <div className="p-2 rounded hover:bg-slate-800 opacity-80">Export Tailwind Config</div>
        </div>
      )}

      {/* 15. TABS Component */}
      {type === 'tabs' && (
        <div className="w-full flex items-center justify-around text-xs">
          {['Design', 'Prototype', 'Inspect'].map((tab, idx) => (
            <button
              key={tab}
              onClick={() => setActiveTab(idx)}
              className={`px-3 py-1 rounded transition-colors ${
                activeTab === idx ? 'bg-purple-600 text-white font-semibold' : 'text-slate-400'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      {/* 16. ACCORDION Component */}
      {type === 'accordion' && (
        <div className="w-full">
          <div className="flex items-center justify-between font-semibold text-sm">
            <span>{settings.content.heading || 'Frequently Asked Questions'}</span>
            <span className="text-purple-400">+</span>
          </div>
          <p className="text-xs opacity-75 pt-2">
            {settings.content.description || 'All styles are generated in real-time and fully production-ready.'}
          </p>
        </div>
      )}

      {/* 17. AVATAR Component */}
      {type === 'avatar' && (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-base shadow-lg">
            UI
          </div>
          <div>
            <div className="font-bold text-sm">Alex Rivers</div>
            <div className="text-xs opacity-70">Design Technologist</div>
          </div>
        </div>
      )}

      {/* 18. PROGRESS Component */}
      {type === 'progress' && (
        <div className="w-full space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span>Style Export Progress</span>
            <span className="text-purple-400">82%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 w-[82%] rounded-full shadow-[0_0_10px_rgba(139,92,246,0.6)]" />
          </div>
        </div>
      )}

      {/* 19. NOTIFICATION Component */}
      {type === 'notification' && (
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <div className="text-xs">
            <span className="font-bold block text-white">{settings.content.heading || 'New Preset Saved'}</span>
            <span className="opacity-80">{settings.content.description || 'Synced to your local workspace.'}</span>
          </div>
        </div>
      )}

      {/* 20. PROFILE CARD Component */}
      {type === 'profile-card' && (
        <div className="flex flex-col items-center text-center space-y-3 w-full">
          <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-purple-500 via-pink-500 to-cyan-400 shadow-xl">
            <div className="w-full h-full rounded-full bg-[#0B1D3A] flex items-center justify-center text-xl font-bold text-white">
              JD
            </div>
          </div>
          <div>
            <h4 className="font-bold text-lg text-white">Jordan Daniels</h4>
            <p className="text-xs text-purple-300 font-medium">Principal UI Engineer</p>
          </div>
          <p className="text-xs opacity-80 max-w-xs">
            {settings.content.description || 'Crafting accessible design tokens and interactive component libraries.'}
          </p>
          <button className="px-4 py-1.5 rounded-full bg-purple-600 text-white text-xs font-semibold shadow-md">
            {settings.content.buttonText || 'Follow'}
          </button>
        </div>
      )}

      {/* 21. LOGIN FORM Component */}
      {type === 'login-form' && (
        <div className="w-full space-y-3 text-left">
          <div className="space-y-1">
            <h4 className="font-bold text-base text-white">{settings.content.heading || 'Welcome Back'}</h4>
            <p className="text-xs opacity-75">Sign in to sync your playgrounds</p>
          </div>
          <div className="space-y-2">
            <input
              type="email"
              placeholder="name@company.com"
              className="w-full px-3 py-2 rounded-lg bg-[#07152B] border border-slate-700 text-xs text-white"
            />
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-lg bg-[#07152B] border border-slate-700 text-xs text-white"
            />
          </div>
          <button className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-xs shadow-md">
            {settings.content.buttonText || 'Sign In'}
          </button>
        </div>
      )}

      {/* 22. PRICING CARD Component */}
      {type === 'pricing-card' && (
        <div className="w-full space-y-4 text-center">
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/40">
            {settings.content.badgeText || 'MOST POPULAR'}
          </span>
          <h4 className="font-bold text-xl text-white">Developer Pro</h4>
          <div className="text-3xl font-extrabold text-white">
            $29 <span className="text-xs font-normal opacity-70">/ month</span>
          </div>
          <ul className="text-xs space-y-1.5 opacity-90 text-left pt-2">
            <li className="flex items-center gap-2">✓ Unlimited Component Presets</li>
            <li className="flex items-center gap-2">✓ SCSS & Tailwind Compilation</li>
            <li className="flex items-center gap-2">✓ Responsive Media Breakpoints</li>
          </ul>
          <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold shadow-lg">
            {settings.content.buttonText || 'Upgrade to Pro'}
          </button>
        </div>
      )}

      {/* 23. HERO SECTION Component */}
      {type === 'hero-section' && (
        <div className="w-full text-center space-y-3 py-4">
          <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400">Production Ready 2.0</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
            {settings.content.heading || 'Build Faster with UI Playground'}
          </h2>
          <p className="text-xs opacity-80 max-w-md mx-auto">
            {settings.content.description || 'Test interactive components, simulate mobile devices, and copy production-ready CSS.'}
          </p>
          <div className="flex justify-center gap-2 pt-2">
            <button className="px-4 py-2 rounded-lg bg-purple-600 text-white text-xs font-bold shadow-md">
              {settings.content.buttonText || 'Start Free'}
            </button>
          </div>
        </div>
      )}

      {/* 24. IMAGE CARD Component */}
      {type === 'image-card' && (
        <div className="w-full space-y-3 overflow-hidden">
          <div className="w-full h-32 rounded-lg bg-gradient-to-br from-indigo-700 via-purple-800 to-pink-700 flex items-center justify-center text-white relative">
            <SparklesIcon size={28} className="animate-bounce" />
            <div className="absolute bottom-2 left-2 text-[10px] font-mono px-2 py-0.5 rounded bg-black/50 backdrop-blur-sm">
              Featured Asset
            </div>
          </div>
          <h4 className="font-bold text-sm text-white">{settings.content.heading || 'Vibrant Gradients Pack'}</h4>
          <p className="text-xs opacity-80">{settings.content.description || 'Curated high-contrast meshes for high-end web applications.'}</p>
        </div>
      )}

      {/* 25. SPINNER Component */}
      {type === 'spinner' && (
        <div className="flex items-center justify-center p-2">
          <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
        </div>
      )}

      {/* 26. SKELETON LOADER Component */}
      {type === 'skeleton' && (
        <div className="w-full space-y-2.5 animate-pulse">
          <div className="h-4 bg-slate-700/60 rounded w-3/4" />
          <div className="h-3 bg-slate-700/40 rounded w-full" />
          <div className="h-3 bg-slate-700/40 rounded w-5/6" />
        </div>
      )}
      </div>
    </div>
  );
};
