import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  ComponentType,
  ComponentSettings,
  DeviceType,
  CodeTab,
  LayoutSettings,
  BorderSettings,
  ColorSettings,
  TypographySettings,
  ShadowSettings,
  TransformSettings,
  HoverSettings,
  TransitionSettings,
  AnimationSettings,
  ContentSettings,
  SavedDesign,
  HistoryItem,
} from '../types/playground';
import { getDefaultSettings } from '../data/initialComponents';
import { saveHistoryItem } from '../utils/historyStorage';

interface ToastState {
  id: number;
  message: string;
  type: 'success' | 'info';
}

interface PlaygroundContextType {
  selectedComponent: ComponentType;
  selectComponent: (type: ComponentType) => void;
  settings: ComponentSettings;
  device: DeviceType;
  setDevice: (device: DeviceType) => void;
  codeTab: CodeTab;
  setCodeTab: (tab: CodeTab) => void;

  // Hold, Release & Lock states
  isHeld: boolean;
  isLocked: boolean;
  toggleHold: () => void;
  toggleLock: () => void;
  manualCss: string | null;
  setManualCss: (css: string | null) => void;
  applyManualCss: (css: string) => void;

  tabletSettings: Partial<ComponentSettings>;
  mobileSettings: Partial<ComponentSettings>;

  updateLayout: (changes: Partial<LayoutSettings>) => void;
  updateBorder: (changes: Partial<BorderSettings>) => void;
  updateColor: (changes: Partial<ColorSettings>) => void;
  updateTypography: (changes: Partial<TypographySettings>) => void;
  updateShadow: (changes: Partial<ShadowSettings>) => void;
  updateTransform: (changes: Partial<TransformSettings>) => void;
  updateHover: (changes: Partial<HoverSettings>) => void;
  updateTransition: (changes: Partial<TransitionSettings>) => void;
  updateAnimation: (changes: Partial<AnimationSettings>) => void;
  updateContent: (changes: Partial<ContentSettings>) => void;

  setResponsiveOverride: (dev: 'tablet' | 'mobile', section: keyof ComponentSettings, field: string, val: any) => void;
  loadSavedDesign: (design: SavedDesign) => void;
  loadHistoryItem: (item: HistoryItem) => void;
  resetCurrentSettings: () => void;

  toast: ToastState | null;
  showToast: (message: string, type?: 'success' | 'info') => void;
  closeToast: () => void;
}

const PlaygroundContext = createContext<PlaygroundContextType | undefined>(undefined);

export const PlaygroundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedComponent, setSelectedComponent] = useState<ComponentType>('card');
  const [settings, setSettings] = useState<ComponentSettings>(() => getDefaultSettings('card'));
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [codeTab, setCodeTab] = useState<CodeTab>('css');
  const [isHeld, setIsHeld] = useState<boolean>(false);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [manualCss, setManualCss] = useState<string | null>(null);

  const [tabletSettings, setTabletSettings] = useState<Partial<ComponentSettings>>({
    typography: { fontSize: 16 } as any,
    layout: { padding: 20 } as any,
  });
  const [mobileSettings, setMobileSettings] = useState<Partial<ComponentSettings>>({
    typography: { fontSize: 15 } as any,
    layout: { padding: 16 } as any,
  });
  const [toast, setToast] = useState<ToastState | null>(null);

  // Active session ID for auto-recording into History
  const currentSessionIdRef = useRef<string>('hist-' + Date.now());
  const isInitialMount = useRef<boolean>(true);
  const debounceTimerRef = useRef<number | null>(null);

  // Auto-record to History after meaningful edits (debounced 1.5s)
  useEffect(() => {
    // Skip recording immediately on first mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = window.setTimeout(() => {
      saveHistoryItem({
        sessionId: currentSessionIdRef.current,
        componentType: selectedComponent,
        settings,
        device,
        responsive: {
          tablet: tabletSettings,
          mobile: mobileSettings,
        },
      });
    }, 1500);

    return () => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }
    };
  }, [selectedComponent, settings, device, tabletSettings, mobileSettings]);

  const selectComponent = (type: ComponentType) => {
    if (isLocked) {
      showToast('Component is LOCKED. Unlock to switch components.', 'info');
      return;
    }
    // Generate new history session for new component
    currentSessionIdRef.current = 'hist-' + Date.now();
    setSelectedComponent(type);
    setSettings(getDefaultSettings(type));
    setManualCss(null);
  };

  const toggleHold = () => {
    if (isLocked) {
      showToast('Design is LOCKED. Unlock first.', 'info');
      return;
    }
    setIsHeld((prev) => {
      const next = !prev;
      if (next) {
        showToast('HOLD active: Visual controls frozen. CSS editor is editable.', 'info');
      } else {
        showToast('RELEASED: Visual controls unlocked. Changes preserved.', 'success');
      }
      return next;
    });
  };

  const toggleLock = () => {
    setIsLocked((prev) => {
      const next = !prev;
      if (next) {
        showToast('LOCKED: Design protected from accidental edits.', 'info');
      } else {
        showToast('UNLOCKED: Design is now editable.', 'success');
      }
      return next;
    });
  };

  // Smart CSS parser to apply raw CSS typed in the Code Editor to the live preview
  const applyManualCss = (cssText: string) => {
    setManualCss(cssText);

    // Extract property declarations
    const decls: Record<string, string> = {};
    const lines = cssText.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('/*') || trimmed.startsWith('//') || trimmed.includes('{') || trimmed.includes('}')) {
        continue;
      }
      const colonIdx = trimmed.indexOf(':');
      if (colonIdx > 0) {
        const prop = trimmed.slice(0, colonIdx).trim().toLowerCase();
        let val = trimmed.slice(colonIdx + 1).trim();
        if (val.endsWith(';')) val = val.slice(0, -1).trim();
        decls[prop] = val;
      }
    }

    setSettings((prev) => {
      const updated = { ...prev };

      // Background
      if (decls['background'] || decls['background-color']) {
        const bg = decls['background'] || decls['background-color'];
        if (bg.includes('linear-gradient')) {
          updated.color = { ...updated.color, bgType: 'linear-gradient' };
        } else if (bg.includes('radial-gradient')) {
          updated.color = { ...updated.color, bgType: 'radial-gradient' };
        } else {
          updated.color = { ...updated.color, bgType: 'solid', bgColor: bg };
        }
      }

      // Color
      if (decls['color']) {
        updated.color = { ...updated.color, textColor: decls['color'] };
      }

      // Padding
      if (decls['padding']) {
        const num = parseInt(decls['padding'], 10);
        if (!isNaN(num)) updated.layout = { ...updated.layout, padding: num };
      }

      // Margin
      if (decls['margin']) {
        const num = parseInt(decls['margin'], 10);
        if (!isNaN(num)) updated.layout = { ...updated.layout, margin: num };
      }

      // Width
      if (decls['width']) {
        updated.layout = { ...updated.layout, width: decls['width'] };
      }

      // Max Width
      if (decls['max-width']) {
        updated.layout = { ...updated.layout, maxWidth: decls['max-width'] };
      }

      // Font Size
      if (decls['font-size']) {
        const num = parseInt(decls['font-size'], 10);
        if (!isNaN(num)) updated.typography = { ...updated.typography, fontSize: num };
      }

      // Font Weight
      if (decls['font-weight']) {
        updated.typography = { ...updated.typography, fontWeight: decls['font-weight'] };
      }

      // Line Height
      if (decls['line-height']) {
        const num = parseFloat(decls['line-height']);
        if (!isNaN(num)) updated.typography = { ...updated.typography, lineHeight: num };
      }

      // Letter Spacing
      if (decls['letter-spacing']) {
        const num = parseFloat(decls['letter-spacing']);
        if (!isNaN(num)) updated.typography = { ...updated.typography, letterSpacing: num };
      }

      // Border Radius
      if (decls['border-radius']) {
        const num = parseInt(decls['border-radius'], 10);
        if (!isNaN(num)) {
          updated.border = {
            ...updated.border,
            radius: num,
            topLeft: num,
            topRight: num,
            bottomRight: num,
            bottomLeft: num,
          };
        }
      }

      // Opacity
      if (decls['opacity']) {
        const num = parseFloat(decls['opacity']);
        if (!isNaN(num)) updated.color = { ...updated.color, opacity: Math.round(num * 100) };
      }

      // Transform
      if (decls['transform']) {
        const tr = decls['transform'];
        const rotMatch = tr.match(/rotate\(([-0-9.]+)deg\)/);
        const scaleMatch = tr.match(/scale\(([-0-9.]+)\)/);
        const txMatch = tr.match(/translate(?:X)?\(([-0-9.]+)px(?:,\s*([-0-9.]+)px)?\)/);

        updated.transform = {
          ...updated.transform,
          rotate: rotMatch ? parseFloat(rotMatch[1]) : updated.transform.rotate,
          scale: scaleMatch ? parseFloat(scaleMatch[1]) : updated.transform.scale,
          translateX: txMatch ? parseFloat(txMatch[1]) : updated.transform.translateX,
          translateY: txMatch && txMatch[2] ? parseFloat(txMatch[2]) : updated.transform.translateY,
        };
      }

      return updated;
    });
  };

  const updateLayout = (changes: Partial<LayoutSettings>) => {
    if (isHeld || isLocked) return;
    setSettings((prev) => ({
      ...prev,
      layout: { ...prev.layout, ...changes },
    }));
  };

  const updateBorder = (changes: Partial<BorderSettings>) => {
    if (isHeld || isLocked) return;
    setSettings((prev) => {
      const updated = { ...prev.border, ...changes };
      if (changes.radius !== undefined && updated.linkedCorners) {
        updated.topLeft = changes.radius;
        updated.topRight = changes.radius;
        updated.bottomRight = changes.radius;
        updated.bottomLeft = changes.radius;
      }
      return {
        ...prev,
        border: updated,
      };
    });
  };

  const updateColor = (changes: Partial<ColorSettings>) => {
    if (isHeld || isLocked) return;
    setSettings((prev) => ({
      ...prev,
      color: { ...prev.color, ...changes },
    }));
  };

  const updateTypography = (changes: Partial<TypographySettings>) => {
    if (isHeld || isLocked) return;
    setSettings((prev) => ({
      ...prev,
      typography: { ...prev.typography, ...changes },
    }));
  };

  const updateShadow = (changes: Partial<ShadowSettings>) => {
    if (isHeld || isLocked) return;
    setSettings((prev) => ({
      ...prev,
      shadow: { ...prev.shadow, ...changes },
    }));
  };

  const updateTransform = (changes: Partial<TransformSettings>) => {
    if (isHeld || isLocked) return;
    setSettings((prev) => ({
      ...prev,
      transform: { ...prev.transform, ...changes },
    }));
  };

  const updateHover = (changes: Partial<HoverSettings>) => {
    if (isHeld || isLocked) return;
    setSettings((prev) => ({
      ...prev,
      hover: { ...prev.hover, ...changes },
    }));
  };

  const updateTransition = (changes: Partial<TransitionSettings>) => {
    if (isHeld || isLocked) return;
    setSettings((prev) => ({
      ...prev,
      transition: { ...prev.transition, ...changes },
    }));
  };

  const updateAnimation = (changes: Partial<AnimationSettings>) => {
    if (isHeld || isLocked) return;
    setSettings((prev) => ({
      ...prev,
      animation: { ...prev.animation, ...changes },
    }));
  };

  const updateContent = (changes: Partial<ContentSettings>) => {
    if (isHeld || isLocked) return;
    setSettings((prev) => ({
      ...prev,
      content: { ...prev.content, ...changes },
    }));
  };

  const setResponsiveOverride = (dev: 'tablet' | 'mobile', section: keyof ComponentSettings, field: string, val: any) => {
    if (isHeld || isLocked) return;
    const setter = dev === 'tablet' ? setTabletSettings : setMobileSettings;
    setter((prev) => {
      const sectionObj = (prev[section] as any) || {};
      return {
        ...prev,
        [section]: {
          ...sectionObj,
          [field]: val,
        },
      };
    });
  };

  const loadSavedDesign = (design: SavedDesign) => {
    if (isLocked) {
      showToast('Design is LOCKED. Unlock to load another design.', 'info');
      return;
    }
    // When loading a saved design, start a new history session for working with it
    currentSessionIdRef.current = 'hist-' + Date.now();
    setSelectedComponent(design.componentType);
    setSettings(design.settings);
    setManualCss(null);
    if (design.responsive?.tablet) setTabletSettings(design.responsive.tablet);
    if (design.responsive?.mobile) setMobileSettings(design.responsive.mobile);
  };

  const loadHistoryItem = (item: HistoryItem) => {
    if (isLocked) {
      showToast('Design is LOCKED. Unlock to restore history.', 'info');
      return;
    }
    // Continue editing that specific history session
    currentSessionIdRef.current = item.id;
    setSelectedComponent(item.componentType);
    setSettings(item.settings);
    setDevice(item.device || 'desktop');
    setManualCss(null);
    if (item.responsive?.tablet) setTabletSettings(item.responsive.tablet);
    if (item.responsive?.mobile) setMobileSettings(item.responsive.mobile);
  };

  const resetCurrentSettings = () => {
    if (isLocked) {
      showToast('Design is LOCKED. Unlock to reset.', 'info');
      return;
    }
    setSettings(getDefaultSettings(selectedComponent));
    setManualCss(null);
    showToast(`Reset ${selectedComponent} to defaults`, 'info');
  };

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    const id = Date.now();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((cur) => (cur?.id === id ? null : cur));
    }, 2800);
  };

  const closeToast = () => {
    setToast(null);
  };

  return (
    <PlaygroundContext.Provider
      value={{
        selectedComponent,
        selectComponent,
        settings,
        device,
        setDevice,
        codeTab,
        setCodeTab,
        isHeld,
        isLocked,
        toggleHold,
        toggleLock,
        manualCss,
        setManualCss,
        applyManualCss,
        tabletSettings,
        mobileSettings,
        updateLayout,
        updateBorder,
        updateColor,
        updateTypography,
        updateShadow,
        updateTransform,
        updateHover,
        updateTransition,
        updateAnimation,
        updateContent,
        setResponsiveOverride,
        loadSavedDesign,
        loadHistoryItem,
        resetCurrentSettings,
        toast,
        showToast,
        closeToast,
      }}
    >
      {children}
    </PlaygroundContext.Provider>
  );
};

export const usePlayground = (): PlaygroundContextType => {
  const context = useContext(PlaygroundContext);
  if (!context) {
    throw new Error('usePlayground must be used within a PlaygroundProvider');
  }
  return context;
};
