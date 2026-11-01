export type ComponentCategory = 'basic' | 'ui' | 'advanced';

export type ComponentType =
  // Basic
  | 'card'
  | 'button'
  | 'input'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'toggle'
  // UI
  | 'navbar'
  | 'badge'
  | 'alert'
  | 'modal'
  | 'tooltip'
  | 'dropdown'
  | 'tabs'
  | 'accordion'
  | 'avatar'
  | 'progress'
  | 'notification'
  // Advanced
  | 'profile-card'
  | 'login-form'
  | 'pricing-card'
  | 'hero-section'
  | 'image-card'
  | 'spinner'
  | 'skeleton';

export type DeviceType = 'desktop' | 'tablet' | 'mobile';

export type CodeTab = 'css' | 'scss' | 'tailwind';

export interface BorderSettings {
  radius: number; // up to 200px+
  linkedCorners: boolean;
  topLeft: number;
  topRight: number;
  bottomRight: number;
  bottomLeft: number;
  width: number;
  style: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  color: string;
}

export interface ColorSettings {
  bgType: 'solid' | 'linear-gradient' | 'radial-gradient';
  bgColor: string;
  gradientColor1: string;
  gradientColor2: string;
  gradientDirection: string; // e.g. "135deg"
  textColor: string;
  borderColor: string;
  accentColor: string;
  opacity: number; // 0 to 100
}

export interface LayoutSettings {
  width: string;
  height: string;
  minWidth: string;
  maxWidth: string;
  minHeight: string;
  maxHeight: string;
  padding: number; // up to 200px+
  margin: number;  // up to 200px+
  gap: number;
  display: 'flex' | 'grid' | 'block' | 'inline-flex' | 'inline-block';
  position: 'relative' | 'static' | 'absolute' | 'fixed';
  top: string;
  right: string;
  bottom: string;
  left: string;
  flexDirection: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  justifyContent: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
}

export interface TypographySettings {
  fontFamily: string;
  fontSize: number; // up to 120px
  fontWeight: string;
  lineHeight: number; // multiplier e.g. 1.5
  letterSpacing: number; // in px
  textAlign: 'left' | 'center' | 'right' | 'justify';
  textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textDecoration: 'none' | 'underline' | 'line-through';
}

export interface ShadowSettings {
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number; // 0 to 100
  inset: boolean;
}

export interface TransformSettings {
  translateX: number;
  translateY: number;
  scale: number;
  rotate: number;
  skewX: number;
  skewY: number;
}

export interface HoverSettings {
  enabled: boolean;
  bgColor: string;
  textColor: string;
  borderColor: string;
  scale: number;
  rotate: number;
  translateY: number;
  shadowBlur: number;
  shadowColor: string;
  opacity: number;
}

export interface TransitionSettings {
  property: string;
  duration: number; // in ms
  delay: number; // in ms
  timingFunction: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

export type AnimationPreset =
  | 'none'
  | 'fade-in'
  | 'fade-up'
  | 'fade-down'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'scale-in'
  | 'zoom-in'
  | 'zoom-out'
  | 'bounce'
  | 'pulse'
  | 'float'
  | 'glow'
  | 'shake'
  | 'rotate'
  | 'swing'
  | 'wiggle'
  | 'heartbeat'
  | 'shimmer';

export interface AnimationSettings {
  preset: AnimationPreset;
  duration: number; // in ms
  delay: number; // in ms
  iterationCount: 'infinite' | '1' | '2' | '3';
  direction: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  timingFunction: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
}

export interface ContentSettings {
  heading: string;
  description: string;
  buttonText: string;
  label: string;
  placeholder: string;
  badgeText: string;
  tagline?: string;
  avatarUrl?: string;
}

export interface ComponentSettings {
  layout: LayoutSettings;
  border: BorderSettings;
  color: ColorSettings;
  typography: TypographySettings;
  shadow: ShadowSettings;
  transform: TransformSettings;
  hover: HoverSettings;
  transition: TransitionSettings;
  animation: AnimationSettings;
  content: ContentSettings;
}

export interface ResponsiveSettings {
  desktop: ComponentSettings;
  tablet: Partial<ComponentSettings>;
  mobile: Partial<ComponentSettings>;
}

export interface SavedDesign {
  id: string;
  name: string;
  componentType: ComponentType;
  category: ComponentCategory;
  createdAt: string;
  settings: ComponentSettings;
  responsive?: {
    tablet?: Partial<ComponentSettings>;
    mobile?: Partial<ComponentSettings>;
  };
}

export interface HistoryItem {
  id: string;
  name: string;
  componentType: ComponentType;
  category: ComponentCategory;
  device: DeviceType;
  updatedAt: string;
  settings: ComponentSettings;
  responsive?: {
    tablet?: Partial<ComponentSettings>;
    mobile?: Partial<ComponentSettings>;
  };
}

export interface ComponentMeta {
  type: ComponentType;
  name: string;
  category: ComponentCategory;
  description: string;
  iconName: string;
}
