export interface AnimationPresetData {
  id: string;
  name: string;
  keyframesName: string;
  cssKeyframes: string;
}

export const ANIMATION_PRESETS: Record<string, AnimationPresetData> = {
  'fade-in': {
    id: 'fade-in',
    name: 'Fade In',
    keyframesName: 'uiFadeIn',
    cssKeyframes: `@keyframes uiFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}`,
  },
  'fade-up': {
    id: 'fade-up',
    name: 'Fade Up',
    keyframesName: 'uiFadeUp',
    cssKeyframes: `@keyframes uiFadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}`,
  },
  'fade-down': {
    id: 'fade-down',
    name: 'Fade Down',
    keyframesName: 'uiFadeDown',
    cssKeyframes: `@keyframes uiFadeDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}`,
  },
  'slide-up': {
    id: 'slide-up',
    name: 'Slide Up',
    keyframesName: 'uiSlideUp',
    cssKeyframes: `@keyframes uiSlideUp {
  from { transform: translateY(40px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}`,
  },
  'slide-down': {
    id: 'slide-down',
    name: 'Slide Down',
    keyframesName: 'uiSlideDown',
    cssKeyframes: `@keyframes uiSlideDown {
  from { transform: translateY(-40px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}`,
  },
  'slide-left': {
    id: 'slide-left',
    name: 'Slide Left',
    keyframesName: 'uiSlideLeft',
    cssKeyframes: `@keyframes uiSlideLeft {
  from { transform: translateX(40px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}`,
  },
  'slide-right': {
    id: 'slide-right',
    name: 'Slide Right',
    keyframesName: 'uiSlideRight',
    cssKeyframes: `@keyframes uiSlideRight {
  from { transform: translateX(-40px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}`,
  },
  'scale-in': {
    id: 'scale-in',
    name: 'Scale In',
    keyframesName: 'uiScaleIn',
    cssKeyframes: `@keyframes uiScaleIn {
  from { transform: scale(0.85); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}`,
  },
  'zoom-in': {
    id: 'zoom-in',
    name: 'Zoom In',
    keyframesName: 'uiZoomIn',
    cssKeyframes: `@keyframes uiZoomIn {
  from { transform: scale(0.6); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}`,
  },
  'zoom-out': {
    id: 'zoom-out',
    name: 'Zoom Out',
    keyframesName: 'uiZoomOut',
    cssKeyframes: `@keyframes uiZoomOut {
  from { transform: scale(1.3); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}`,
  },
  'bounce': {
    id: 'bounce',
    name: 'Bounce',
    keyframesName: 'uiBounce',
    cssKeyframes: `@keyframes uiBounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-18px); }
  60% { transform: translateY(-9px); }
}`,
  },
  'pulse': {
    id: 'pulse',
    name: 'Pulse',
    keyframesName: 'uiPulse',
    cssKeyframes: `@keyframes uiPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.06); }
  100% { transform: scale(1); }
}`,
  },
  'float': {
    id: 'float',
    name: 'Float',
    keyframesName: 'uiFloat',
    cssKeyframes: `@keyframes uiFloat {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}`,
  },
  'glow': {
    id: 'glow',
    name: 'Glow',
    keyframesName: 'uiGlow',
    cssKeyframes: `@keyframes uiGlow {
  0% { box-shadow: 0 0 10px rgba(139, 92, 246, 0.4); }
  50% { box-shadow: 0 0 35px rgba(236, 72, 153, 0.8), 0 0 60px rgba(124, 58, 237, 0.6); }
  100% { box-shadow: 0 0 10px rgba(139, 92, 246, 0.4); }
}`,
  },
  'shake': {
    id: 'shake',
    name: 'Shake',
    keyframesName: 'uiShake',
    cssKeyframes: `@keyframes uiShake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-8px); }
  40%, 80% { transform: translateX(8px); }
}`,
  },
  'rotate': {
    id: 'rotate',
    name: 'Rotate',
    keyframesName: 'uiRotate',
    cssKeyframes: `@keyframes uiRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}`,
  },
  'swing': {
    id: 'swing',
    name: 'Swing',
    keyframesName: 'uiSwing',
    cssKeyframes: `@keyframes uiSwing {
  20% { transform: rotate(15deg); }
  40% { transform: rotate(-10deg); }
  60% { transform: rotate(5deg); }
  80% { transform: rotate(-5deg); }
  100% { transform: rotate(0deg); }
}`,
  },
  'wiggle': {
    id: 'wiggle',
    name: 'Wiggle',
    keyframesName: 'uiWiggle',
    cssKeyframes: `@keyframes uiWiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-6deg); }
  75% { transform: rotate(6deg); }
}`,
  },
  'heartbeat': {
    id: 'heartbeat',
    name: 'Heartbeat',
    keyframesName: 'uiHeartbeat',
    cssKeyframes: `@keyframes uiHeartbeat {
  0% { transform: scale(1); }
  14% { transform: scale(1.15); }
  28% { transform: scale(1); }
  42% { transform: scale(1.15); }
  70% { transform: scale(1); }
}`,
  },
  'shimmer': {
    id: 'shimmer',
    name: 'Shimmer',
    keyframesName: 'uiShimmer',
    cssKeyframes: `@keyframes uiShimmer {
  0% { opacity: 0.6; filter: brightness(0.9); }
  50% { opacity: 1; filter: brightness(1.25); }
  100% { opacity: 0.6; filter: brightness(0.9); }
}`,
  },
};
