import { ComponentMeta, ComponentSettings, ComponentType } from '../types/playground';

export const COMPONENT_LIST: ComponentMeta[] = [
  // Basic
  { type: 'card', name: 'Card', category: 'basic', description: 'Content card with custom styles', iconName: 'Card' },
  { type: 'button', name: 'Button', category: 'basic', description: 'Interactive button with hover effects', iconName: 'Button' },
  { type: 'input', name: 'Input', category: 'basic', description: 'Form input field with focus styles', iconName: 'Input' },
  { type: 'textarea', name: 'Textarea', category: 'basic', description: 'Multi-line text input field', iconName: 'Textarea' },
  { type: 'select', name: 'Select', category: 'basic', description: 'Custom styled select dropdown', iconName: 'Select' },
  { type: 'checkbox', name: 'Checkbox', category: 'basic', description: 'Custom styled checkbox toggle', iconName: 'Checkbox' },
  { type: 'radio', name: 'Radio', category: 'basic', description: 'Radio selection button', iconName: 'Radio' },
  { type: 'toggle', name: 'Toggle Switch', category: 'basic', description: 'Animated switch control', iconName: 'Toggle' },

  // UI
  { type: 'navbar', name: 'Navbar', category: 'ui', description: 'Header navigation container', iconName: 'Navbar' },
  { type: 'badge', name: 'Badge', category: 'ui', description: 'Status or count indicator badge', iconName: 'Badge' },
  { type: 'alert', name: 'Alert', category: 'ui', description: 'Feedback and warning notification box', iconName: 'Alert' },
  { type: 'modal', name: 'Modal', category: 'ui', description: 'Centered overlay popup dialog', iconName: 'Modal' },
  { type: 'tooltip', name: 'Tooltip', category: 'ui', description: 'Contextual hover bubble', iconName: 'Tooltip' },
  { type: 'dropdown', name: 'Dropdown Menu', category: 'ui', description: 'Floating action item menu', iconName: 'Dropdown' },
  { type: 'tabs', name: 'Tabs', category: 'ui', description: 'Segmented navigation switcher', iconName: 'Tabs' },
  { type: 'accordion', name: 'Accordion', category: 'ui', description: 'Collapsible content panel', iconName: 'Accordion' },
  { type: 'avatar', name: 'Avatar', category: 'ui', description: 'User profile picture / avatar', iconName: 'Avatar' },
  { type: 'progress', name: 'Progress Bar', category: 'ui', description: 'Visual progress percentage bar', iconName: 'Progress' },
  { type: 'notification', name: 'Notification Toast', category: 'ui', description: 'Floating message toast popup', iconName: 'Notification' },

  // Advanced
  { type: 'profile-card', name: 'Profile Card', category: 'advanced', description: 'Rich user profile with social links', iconName: 'ProfileCard' },
  { type: 'login-form', name: 'Login Form', category: 'advanced', description: 'Complete styled authentication card', iconName: 'LoginForm' },
  { type: 'pricing-card', name: 'Pricing Card', category: 'advanced', description: 'SaaS tier pricing tier card', iconName: 'PricingCard' },
  { type: 'hero-section', name: 'Hero Section', category: 'advanced', description: 'Landing page hero block banner', iconName: 'HeroSection' },
  { type: 'image-card', name: 'Image Card', category: 'advanced', description: 'Modern card with media showcase', iconName: 'ImageCard' },
  { type: 'spinner', name: 'Loading Spinner', category: 'advanced', description: 'Animated CSS gradient spinner', iconName: 'Spinner' },
  { type: 'skeleton', name: 'Skeleton Loader', category: 'advanced', description: 'Shimmering placeholder element', iconName: 'Skeleton' },
];

export const getDefaultSettings = (type: ComponentType): ComponentSettings => {
  // Base default settings closely aligned with reference image
  const base: ComponentSettings = {
    layout: {
      width: '100%',
      height: 'auto',
      minWidth: '280px',
      maxWidth: '480px',
      minHeight: 'auto',
      maxHeight: 'none',
      padding: 24,
      margin: 0,
      gap: 16,
      display: 'flex',
      position: 'relative',
      top: '0',
      right: '0',
      bottom: '0',
      left: '0',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
    },
    border: {
      radius: 20,
      linkedCorners: true,
      topLeft: 20,
      topRight: 20,
      bottomRight: 20,
      bottomLeft: 20,
      width: 1,
      style: 'solid',
      color: '#12345C',
    },
    color: {
      bgType: 'solid',
      bgColor: '#0B1D3A',
      gradientColor1: '#7C3AED',
      gradientColor2: '#EC4899',
      gradientDirection: '135deg',
      textColor: '#E2E8F0',
      borderColor: '#12345C',
      accentColor: '#7C3AED',
      opacity: 100,
    },
    typography: {
      fontFamily: "'Inter', sans-serif",
      fontSize: 18,
      fontWeight: '600',
      lineHeight: 1.5,
      letterSpacing: 0,
      textAlign: 'left',
      textTransform: 'none',
      textDecoration: 'none',
    },
    shadow: {
      x: 0,
      y: 10,
      blur: 20,
      spread: 0,
      color: 'rgba(0, 0, 0, 0.4)',
      opacity: 40,
      inset: false,
    },
    transform: {
      translateX: 0,
      translateY: 0,
      scale: 1,
      rotate: 0,
      skewX: 0,
      skewY: 0,
    },
    hover: {
      enabled: false,
      bgColor: '',
      textColor: '',
      borderColor: '',
      scale: 1,
      rotate: 0,
      translateY: 0,
      shadowBlur: 0,
      shadowColor: 'rgba(0, 0, 0, 0)',
      opacity: 100,
    },
    transition: {
      property: 'all',
      duration: 300,
      delay: 0,
      timingFunction: 'ease',
    },
    animation: {
      preset: 'none',
      duration: 1000,
      delay: 0,
      iterationCount: 'infinite',
      direction: 'normal',
      timingFunction: 'ease-in-out',
    },
    content: {
      heading: 'Create Something Beautiful',
      description: 'A simple and powerful way to turn your ideas into stunning user interfaces.',
      buttonText: 'Get Started →',
      label: 'Email address',
      placeholder: 'Enter your email...',
      badgeText: 'New Feature',
      tagline: 'Design System',
    },
  };

  switch (type) {
    case 'card':
      return {
        ...base,
        hover: {
          enabled: true,
          bgColor: '#0F264C',
          textColor: '#FFFFFF',
          borderColor: '#8B5CF6',
          scale: 1.02,
          rotate: 0,
          translateY: -4,
          shadowBlur: 30,
          shadowColor: 'rgba(124, 58, 237, 0.35)',
          opacity: 100,
        },
      };
    case 'button':
      return {
        ...base,
        layout: {
          ...base.layout,
          width: 'auto',
          maxWidth: '300px',
          padding: 14,
          alignItems: 'center',
          justifyContent: 'center',
          display: 'inline-flex',
          flexDirection: 'row',
        },
        border: {
          ...base.border,
          radius: 12,
          topLeft: 12,
          topRight: 12,
          bottomRight: 12,
          bottomLeft: 12,
          width: 0,
        },
        color: {
          ...base.color,
          bgType: 'linear-gradient',
          gradientColor1: '#7C3AED',
          gradientColor2: '#EC4899',
          gradientDirection: '135deg',
          textColor: '#FFFFFF',
        },
        typography: {
          ...base.typography,
          fontSize: 16,
          fontWeight: '600',
          textAlign: 'center',
        },
        shadow: {
          ...base.shadow,
          y: 6,
          blur: 18,
          color: 'rgba(124, 58, 237, 0.45)',
          opacity: 45,
        },
        hover: {
          ...base.hover,
          scale: 1.04,
          translateY: -2,
          shadowBlur: 24,
          shadowColor: 'rgba(236, 72, 153, 0.55)',
        },
      };

    case 'input':
      return {
        ...base,
        layout: {
          ...base.layout,
          width: '100%',
          maxWidth: '400px',
          padding: 14,
        },
        border: {
          ...base.border,
          radius: 10,
          topLeft: 10,
          topRight: 10,
          bottomRight: 10,
          bottomLeft: 10,
          width: 1,
          color: '#1E3A8A',
        },
        color: {
          ...base.color,
          bgColor: '#07152B',
          textColor: '#F8FAFC',
          borderColor: '#1E3A8A',
        },
        typography: {
          ...base.typography,
          fontSize: 15,
          fontWeight: '400',
        },
        shadow: {
          ...base.shadow,
          y: 2,
          blur: 8,
          color: 'rgba(0, 0, 0, 0.25)',
          opacity: 25,
        },
      };

    case 'badge':
      return {
        ...base,
        layout: {
          ...base.layout,
          width: 'auto',
          maxWidth: '160px',
          padding: 8,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        border: {
          ...base.border,
          radius: 9999,
          topLeft: 9999,
          topRight: 9999,
          bottomRight: 9999,
          bottomLeft: 9999,
          width: 1,
          color: '#8B5CF6',
        },
        color: {
          ...base.color,
          bgColor: 'rgba(124, 58, 237, 0.15)',
          textColor: '#A78BFA',
          borderColor: '#7C3AED',
        },
        typography: {
          ...base.typography,
          fontSize: 13,
          fontWeight: '600',
        },
        shadow: {
          ...base.shadow,
          blur: 10,
          color: 'rgba(124, 58, 237, 0.25)',
        },
      };

    case 'pricing-card':
      return {
        ...base,
        layout: {
          ...base.layout,
          maxWidth: '380px',
          padding: 32,
        },
        border: {
          ...base.border,
          radius: 24,
          topLeft: 24,
          topRight: 24,
          bottomRight: 24,
          bottomLeft: 24,
          width: 2,
          color: '#8B5CF6',
        },
        shadow: {
          ...base.shadow,
          y: 12,
          blur: 35,
          color: 'rgba(124, 58, 237, 0.25)',
        },
      };

    case 'profile-card':
      return {
        ...base,
        layout: {
          ...base.layout,
          maxWidth: '360px',
          padding: 28,
          alignItems: 'center',
        },
        border: {
          ...base.border,
          radius: 24,
          topLeft: 24,
          topRight: 24,
          bottomRight: 24,
          bottomLeft: 24,
        },
        typography: {
          ...base.typography,
          textAlign: 'center',
        },
      };

    case 'spinner':
      return {
        ...base,
        layout: {
          ...base.layout,
          width: '64px',
          height: '64px',
          maxWidth: '64px',
          minWidth: '64px',
          padding: 0,
        },
        border: {
          ...base.border,
          radius: 9999,
          topLeft: 9999,
          topRight: 9999,
          bottomRight: 9999,
          bottomLeft: 9999,
          width: 4,
          color: '#7C3AED',
          style: 'solid',
        },
        animation: {
          preset: 'rotate',
          duration: 1000,
          delay: 0,
          iterationCount: 'infinite',
          direction: 'normal',
          timingFunction: 'linear',
        },
      };

    default:
      return base;
  }
};
