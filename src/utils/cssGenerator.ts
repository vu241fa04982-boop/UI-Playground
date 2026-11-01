
import { ComponentSettings, ComponentType } from '../types/playground';
import { ANIMATION_PRESETS } from '../data/animationPresets';

export function getSelectorForComponent(type: ComponentType): string {
  switch (type) {
    case 'card': return 'ui-card';
    case 'button': return 'ui-button';
    case 'input': return 'ui-input';
    case 'textarea': return 'ui-textarea';
    case 'select': return 'ui-select';
    case 'checkbox': return 'ui-checkbox';
    case 'radio': return 'ui-radio';
    case 'toggle': return 'ui-toggle';
    case 'navbar': return 'ui-navbar';
    case 'badge': return 'ui-badge';
    case 'alert': return 'ui-alert';
    case 'modal': return 'ui-modal';
    case 'tooltip': return 'ui-tooltip';
    case 'dropdown': return 'ui-dropdown';
    case 'tabs': return 'ui-tabs';
    case 'accordion': return 'ui-accordion';
    case 'avatar': return 'ui-avatar';
    case 'progress': return 'ui-progress';
    case 'notification': return 'ui-notification';
    case 'profile-card': return 'ui-profile-card';
    case 'login-form': return 'ui-login-form';
    case 'pricing-card': return 'ui-pricing-card';
    case 'hero-section': return 'ui-hero-section';
    case 'image-card': return 'ui-image-card';
    case 'spinner': return 'ui-spinner';
    case 'skeleton': return 'ui-skeleton';
    default: return 'ui-component';
  }
}

export function generateCss(
  type: ComponentType,
  settings: ComponentSettings,
  tabletSettings?: Partial<ComponentSettings>,
  mobileSettings?: Partial<ComponentSettings>
): string {
  const selector = `.${getSelectorForComponent(type)}`;
  const lines: string[] = [];

  // Component-specific base defaults
  if (type === 'button') {
    lines.push(`  cursor: pointer;`);
    lines.push(`  user-select: none;`);
  } else if (type === 'input' || type === 'textarea' || type === 'select') {
    lines.push(`  outline: none;`);
  }

  // Layout & Sizing
  if (settings.layout.display) lines.push(`  display: ${settings.layout.display};`);
  if (settings.layout.display.includes('flex')) {
    if (settings.layout.flexDirection) lines.push(`  flex-direction: ${settings.layout.flexDirection};`);
    if (settings.layout.justifyContent) lines.push(`  justify-content: ${settings.layout.justifyContent};`);
    if (settings.layout.alignItems) lines.push(`  align-items: ${settings.layout.alignItems};`);
    if (settings.layout.gap) lines.push(`  gap: ${settings.layout.gap}px;`);
  }

  if (settings.layout.width) lines.push(`  width: ${settings.layout.width};`);
  if (settings.layout.height && settings.layout.height !== 'auto') lines.push(`  height: ${settings.layout.height};`);
  if (settings.layout.maxWidth && settings.layout.maxWidth !== 'none') lines.push(`  max-width: ${settings.layout.maxWidth};`);
  if (settings.layout.minWidth && settings.layout.minWidth !== 'auto') lines.push(`  min-width: ${settings.layout.minWidth};`);
  if (settings.layout.padding !== undefined) lines.push(`  padding: ${settings.layout.padding}px;`);
  if (settings.layout.margin) lines.push(`  margin: ${settings.layout.margin}px;`);

  // Background
  if (settings.color.bgType === 'solid') {
    lines.push(`  background: ${settings.color.bgColor};`);
  } else if (settings.color.bgType === 'linear-gradient') {
    lines.push(`  background: linear-gradient(${settings.color.gradientDirection}, ${settings.color.gradientColor1}, ${settings.color.gradientColor2});`);
  } else if (settings.color.bgType === 'radial-gradient') {
    lines.push(`  background: radial-gradient(circle, ${settings.color.gradientColor1}, ${settings.color.gradientColor2});`);
  }

  // Text Color & Typography
  if (settings.color.textColor) lines.push(`  color: ${settings.color.textColor};`);
  if (settings.typography.fontFamily) lines.push(`  font-family: ${settings.typography.fontFamily};`);
  if (settings.typography.fontSize) lines.push(`  font-size: ${settings.typography.fontSize}px;`);
  if (settings.typography.fontWeight) lines.push(`  font-weight: ${settings.typography.fontWeight};`);
  if (settings.typography.lineHeight) lines.push(`  line-height: ${settings.typography.lineHeight};`);
  if (settings.typography.letterSpacing) lines.push(`  letter-spacing: ${settings.typography.letterSpacing}px;`);
  if (settings.typography.textAlign) lines.push(`  text-align: ${settings.typography.textAlign};`);

  if (settings.typography.textTransform && settings.typography.textTransform !== 'none') {
    lines.push(`  text-transform: ${settings.typography.textTransform};`);
  }

  if (settings.typography.textDecoration && settings.typography.textDecoration !== 'none') {
    lines.push(`  text-decoration: ${settings.typography.textDecoration};`);
  }

  // Borders
  if (settings.border.linkedCorners) {
    lines.push(`  border-radius: ${settings.border.radius}px;`);
  } else {
    lines.push(
      `  border-radius: ${settings.border.topLeft}px ${settings.border.topRight}px ${settings.border.bottomRight}px ${settings.border.bottomLeft}px;`
    );
  }

  if (settings.border.width > 0 && settings.border.style !== 'none') {
    lines.push(`  border: ${settings.border.width}px ${settings.border.style} ${settings.border.color};`);
  } else if (settings.border.width === 0) {
    lines.push(`  border: none;`);
  }

  // Box Shadow
  const shadow = settings.shadow;

  if (shadow.blur > 0 || shadow.spread > 0 || shadow.x !== 0 || shadow.y !== 0) {
    const insetStr = shadow.inset ? 'inset ' : '';
    lines.push(`  box-shadow: ${insetStr}${shadow.x}px ${shadow.y}px ${shadow.blur}px ${shadow.spread}px ${shadow.color};`);
  }

  // Transform
  const t = settings.transform;
  const transforms: string[] = [];

  if (t.translateX !== 0 || t.translateY !== 0) {
    transforms.push(`translate(${t.translateX}px, ${t.translateY}px)`);
  }

  if (t.scale !== 1) transforms.push(`scale(${t.scale})`);
  if (t.rotate !== 0) transforms.push(`rotate(${t.rotate}deg)`);

  if (t.skewX !== 0 || t.skewY !== 0) {
    transforms.push(`skew(${t.skewX}deg, ${t.skewY}deg)`);
  }

  if (transforms.length > 0) {
    lines.push(`  transform: ${transforms.join(' ')};`);
  }

  // Opacity
  if (settings.color.opacity < 100) {
    lines.push(`  opacity: ${(settings.color.opacity / 100).toFixed(2)};`);
  }

  // Transition
  if (settings.transition.duration > 0) {
    lines.push(`  transition: ${settings.transition.property} ${settings.transition.duration}ms ${settings.transition.timingFunction};`);
  }

  // Preset Animation
  if (settings.animation.preset && settings.animation.preset !== 'none') {
    const anim = settings.animation;
    const presetData = ANIMATION_PRESETS[anim.preset];
    const keyframesName = presetData ? presetData.keyframesName : anim.preset;
    const fill = anim.fillMode || 'both';

    lines.push(
      `  animation: ${keyframesName} ${anim.duration}ms ${anim.timingFunction} ${anim.delay}ms ${anim.iterationCount} ${anim.direction} ${fill};`
    );
  }

  let fullCss = `${selector} {\n${lines.join('\n')}\n}`;

  // Hover States
  if (settings.hover.enabled) {
    const hoverLines: string[] = [];

    if (settings.hover.bgColor) hoverLines.push(`  background: ${settings.hover.bgColor};`);
    if (settings.hover.textColor) hoverLines.push(`  color: ${settings.hover.textColor};`);
    if (settings.hover.borderColor) hoverLines.push(`  border-color: ${settings.hover.borderColor};`);

    if (settings.hover.shadowBlur > 0) {
      hoverLines.push(`  box-shadow: 0 12px ${settings.hover.shadowBlur}px ${settings.hover.shadowColor};`);
    }

    const hoverTransforms: string[] = [];

    if (settings.hover.translateY !== 0) hoverTransforms.push(`translateY(${settings.hover.translateY}px)`);
    if (settings.hover.scale !== 1) hoverTransforms.push(`scale(${settings.hover.scale})`);
    if (settings.hover.rotate !== 0) hoverTransforms.push(`rotate(${settings.hover.rotate}deg)`);

    if (hoverTransforms.length > 0) {
      hoverLines.push(`  transform: ${hoverTransforms.join(' ')} !important;`);
    }

    if (hoverLines.length > 0) {
      fullCss += `\n\n${selector}:hover {\n${hoverLines.join('\n')}\n}`;
    }
  }

  // Focus state for interactive elements
  if (type === 'input' || type === 'textarea' || type === 'select') {
    fullCss += `\n\n${selector}:focus {\n  border-color: #8B5CF6;\n  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.25);\n}`;
  }

  // Responsive Media Queries (Tablet & Mobile)
  if (tabletSettings && Object.keys(tabletSettings).length > 0) {
    const tabLines: string[] = [];

    if (tabletSettings.typography?.fontSize) tabLines.push(`    font-size: ${tabletSettings.typography.fontSize}px;`);
    if (tabletSettings.layout?.padding !== undefined) tabLines.push(`    padding: ${tabletSettings.layout.padding}px;`);
    if (tabletSettings.layout?.gap !== undefined) tabLines.push(`    gap: ${tabletSettings.layout.gap}px;`);
    if (tabletSettings.border?.radius !== undefined) tabLines.push(`    border-radius: ${tabletSettings.border.radius}px;`);

    if (tabLines.length > 0) {
      fullCss += `\n\n@media (max-width: 768px) {\n  ${selector} {\n${tabLines.join('\n')}\n  }\n}`;
    }
  }

  if (mobileSettings && Object.keys(mobileSettings).length > 0) {
    const mobLines: string[] = [];

    if (mobileSettings.typography?.fontSize) mobLines.push(`    font-size: ${mobileSettings.typography.fontSize}px;`);
    if (mobileSettings.layout?.padding !== undefined) mobLines.push(`    padding: ${mobileSettings.layout.padding}px;`);
    if (mobileSettings.layout?.gap !== undefined) mobLines.push(`    gap: ${mobileSettings.layout.gap}px;`);
    if (mobileSettings.border?.radius !== undefined) mobLines.push(`    border-radius: ${mobileSettings.border.radius}px;`);

    if (mobLines.length > 0) {
      fullCss += `\n\n@media (max-width: 480px) {\n  ${selector} {\n${mobLines.join('\n')}\n  }\n}`;
    }
  }

  // Animation Keyframes definition if preset is active
  if (settings.animation.preset && settings.animation.preset !== 'none') {
    const foundPreset = ANIMATION_PRESETS[settings.animation.preset];

    if (foundPreset && foundPreset.cssKeyframes) {
      fullCss += `\n\n${foundPreset.cssKeyframes}`;
    }
  }

  return fullCss;
}
