import React, { useRef, useState, useEffect, useMemo } from 'react';
import { usePlayground } from '../../context/PlaygroundContext';
import { DeviceSelector } from './DeviceSelector';
import { ComponentRenderer } from './ComponentRenderer';

export const LivePreview: React.FC = () => {
  const { selectedComponent, settings, device, tabletSettings, mobileSettings } = usePlayground();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(700);

  // Measure center panel width to compute scaling if needed
  useEffect(() => {
    const updateWidth = () => {
      if (canvasRef.current) {
        setContainerWidth(canvasRef.current.clientWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Compute active settings merged with responsive overrides
  const activeSettings = useMemo(() => {
    if (device === 'tablet') {
      return {
        ...settings,
        typography: {
          ...settings.typography,
          fontSize: tabletSettings.typography?.fontSize ?? Math.max(14, Math.round(settings.typography.fontSize * 0.9)),
          letterSpacing: tabletSettings.typography?.letterSpacing ?? settings.typography.letterSpacing,
        },
        layout: {
          ...settings.layout,
          padding: tabletSettings.layout?.padding ?? Math.max(16, Math.round(settings.layout.padding * 0.85)),
          gap: tabletSettings.layout?.gap ?? Math.max(12, Math.round(settings.layout.gap * 0.85)),
        },
        border: {
          ...settings.border,
          radius: tabletSettings.border?.radius ?? settings.border.radius,
        },
      };
    }
    if (device === 'mobile') {
      return {
        ...settings,
        typography: {
          ...settings.typography,
          fontSize: mobileSettings.typography?.fontSize ?? Math.max(13, Math.round(settings.typography.fontSize * 0.8)),
          letterSpacing: mobileSettings.typography?.letterSpacing ?? settings.typography.letterSpacing,
        },
        layout: {
          ...settings.layout,
          padding: mobileSettings.layout?.padding ?? Math.max(12, Math.round(settings.layout.padding * 0.7)),
          gap: mobileSettings.layout?.gap ?? Math.max(8, Math.round(settings.layout.gap * 0.75)),
        },
        border: {
          ...settings.border,
          radius: mobileSettings.border?.radius ?? settings.border.radius,
        },
      };
    }
    return settings;
  }, [settings, device, tabletSettings, mobileSettings]);

  // Viewport dimensions based on device specification
  const targetWidth = device === 'mobile' ? 390 : device === 'tablet' ? 768 : Math.min(containerWidth - 32, 840);

  // Compute scale if canvas area is narrower than target device representation
  const availableSpace = Math.max(320, containerWidth - 32);
  const deviceScale = targetWidth > availableSpace ? availableSpace / targetWidth : 1;

  // Auto-fit containment for rotated / scaled / translated components inside device bezel
  const transformFitScale = useMemo(() => {
    const t = activeSettings.transform;
    const rotateRad = (Math.abs(t.rotate || 0) * Math.PI) / 180;
    const scale = t.scale || 1;
    const tx = Math.abs(t.translateX || 0);
    const ty = Math.abs(t.translateY || 0);

    const isSmall = selectedComponent === 'button' || selectedComponent === 'badge' || selectedComponent === 'toggle' || selectedComponent === 'spinner';
    const baseW = isSmall ? 220 : 380;
    const baseH = isSmall ? 60 : 260;

    const boundW = (baseW * Math.cos(rotateRad) + baseH * Math.sin(rotateRad)) * scale + tx * 1.8;
    const boundH = (baseW * Math.sin(rotateRad) + baseH * Math.cos(rotateRad)) * scale + ty * 1.8;

    const maxAvailW = device === 'mobile' ? 320 : device === 'tablet' ? 660 : Math.max(340, containerWidth - 80);
    const maxAvailH = device === 'mobile' ? 480 : device === 'tablet' ? 440 : 440;

    const scaleW = boundW > maxAvailW ? maxAvailW / boundW : 1;
    const scaleH = boundH > maxAvailH ? maxAvailH / boundH : 1;

    return Math.min(scaleW, scaleH, 1);
  }, [activeSettings.transform, selectedComponent, device, containerWidth]);

  return (
    <div className="bg-[#0B1D3A] border border-[#12345C] rounded-2xl shadow-xl flex flex-col h-full overflow-hidden">
      {/* Device Selector & Header */}
      <DeviceSelector />

      {/* Main Canvas Viewport */}
      <div
        ref={canvasRef}
        className="relative flex-1 min-h-[480px] p-4 sm:p-6 flex flex-col items-center justify-center overflow-x-hidden overflow-y-auto bg-gradient-to-b from-[#020817] via-[#051124] to-[#020817] scrollbar-thin"
      >
        {/* Subtle background ambient radial glow */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[120px]" />
          <div className="w-[300px] h-[300px] rounded-full bg-cyan-500/10 blur-[90px]" />
        </div>

        {/* Viewport Frame simulating device */}
        <div
          className="relative z-10 flex items-center justify-center transition-all duration-300 ease-out max-w-full"
          style={{
            width: `${targetWidth * deviceScale}px`,
          }}
        >
          <div
            style={{
              width: `${targetWidth}px`,
              transform: deviceScale < 1 ? `scale(${deviceScale})` : undefined,
              transformOrigin: 'top center',
            }}
            className={`transition-all duration-300 overflow-hidden ${
              device === 'mobile'
                ? 'rounded-3xl border-4 border-slate-700/80 p-4 bg-[#07152B]/95 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative min-h-[540px] flex flex-col items-center justify-start'
                : device === 'tablet'
                ? 'rounded-2xl border-2 border-slate-700/70 p-5 bg-[#07152B]/90 shadow-[0_0_40px_rgba(0,0,0,0.6)] relative min-h-[480px] flex flex-col items-center justify-center'
                : 'rounded-2xl border-2 border-slate-700/70 bg-[#07152B]/95 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative min-h-[480px] flex flex-col overflow-hidden w-full'
            }`}
          >
            {/* Desktop Browser Window Header */}
            {device === 'desktop' && (
              <div className="w-full px-4 py-2.5 border-b border-slate-700/60 bg-[#040C1A]/80 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="flex-1 max-w-xs mx-auto py-1 px-3 rounded-md bg-[#07152B] border border-slate-700/60 text-[11px] font-mono text-slate-400 text-center truncate">
                  https://ui-playground.dev/preview
                </div>
                <div className="w-12 text-right text-[11px] text-slate-500 font-mono">100%</div>
              </div>
            )}

            {/* Mobile speaker notch */}
            {device === 'mobile' && (
              <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-4 flex-shrink-0 flex items-center justify-center">
                <div className="w-10 h-1.5 bg-slate-900 rounded-full" />
              </div>
            )}

            {/* Tablet camera dot */}
            {device === 'tablet' && (
              <div className="w-2.5 h-2.5 bg-slate-800 rounded-full mx-auto mb-3 flex-shrink-0" />
            )}

            {/* Safe preview containment boundary */}
            <div
              className="w-full flex-1 flex items-center justify-center p-4 transition-all duration-200"
              style={{
                transform: transformFitScale < 1 ? `scale(${transformFitScale})` : undefined,
                transformOrigin: 'center center',
              }}
            >
              <ComponentRenderer
                type={selectedComponent}
                settings={activeSettings}
                device={device}
              />
            </div>
          </div>
        </div>

        {/* Device Resolution indicator pill */}
        <div className="absolute bottom-3 right-4 z-20 pointer-events-none">
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-[#07152B]/90 text-slate-400 border border-[#12345C]">
            {device === 'desktop'
              ? 'Desktop View (Wide Viewport)'
              : device === 'tablet'
              ? 'Tablet View (768px)'
              : 'Mobile View (390px)'}
          </span>
        </div>
      </div>
    </div>
  );
};
