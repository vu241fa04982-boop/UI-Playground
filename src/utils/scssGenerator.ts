import { ComponentSettings, ComponentType } from '../types/playground';
import { getSelectorForComponent } from './cssGenerator';
import { ANIMATION_PRESETS } from '../data/animationPresets';

export function generateScss(
  type: ComponentType,
  settings: ComponentSettings,
  tabletSettings?: Partial<ComponentSettings>,
  mobileSettings?: Partial<ComponentSettings>
): string {
  const selector = `.${getSelectorForComponent(type)}`;
  const lines: string[] = [];

  // Component-specific defaults
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
  }

  // Shadow
  const shadow = settings.shadow;
  if (shadow.blur > 0 || shadow.spread > 0 || shadow.x !== 0 || shadow.y !== 0) {
    const insetStr = shadow.inset ? 'inset ' : '';
    lines.push(`  box-shadow: ${insetStr}${shadow.x}px ${shadow.y}px ${shadow.blur}px ${shadow.spread}px ${shadow.color};`);
  }

  // Transform
  const t = settings.transform;
  const transforms: string[] = [];
  if (t.translateX !== 0 || t.translateY !== 0) transforms.push(`translate(${t.translateX}px, ${t.translateY}px)`);
  if (t.scale !== 1) transforms.push(`scale(${t.scale})`);
  if (t.rotate !== 0) transforms.push(`rotate(${t.rotate}deg)`);
  if (t.skewX !== 0 || t.skewY !== 0) transforms.push(`skew(${t.skewX}deg, ${t.skewY}deg)`);
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

  // Animation
  if (settings.animation.preset && settings.animation.preset !== 'none') {
    const anim = settings.animation;
    const presetData = ANIMATION_PRESETS[anim.preset];
    const keyframesName = presetData ? presetData.keyframesName : anim.preset;
    const fill = anim.fillMode || 'both';
    lines.push(
      `  animation: ${keyframesName} ${anim.duration}ms ${anim.timingFunction} ${anim.delay}ms ${anim.iterationCount} ${anim.direction} ${fill};`
    );
  }

  // Nested Hover
  if (settings.hover.enabled) {
    lines.push(`\n  &:hover {`);
    if (settings.hover.bgColor) lines.push(`    background: ${settings.hover.bgColor};`);
    if (settings.hover.textColor) lines.push(`    color: ${settings.hover.textColor};`);
    if (settings.hover.borderColor) lines.push(`    border-color: ${settings.hover.borderColor};`);
    if (settings.hover.shadowBlur > 0) {
      lines.push(`    box-shadow: 0 12px ${settings.hover.shadowBlur}px ${settings.hover.shadowColor};`);
    }
    const tr: string[] = [];
    if (settings.hover.translateY !== 0) tr.push(`translateY(${settings.hover.translateY}px)`);
    if (settings.hover.scale !== 1) tr.push(`scale(${settings.hover.scale})`);
    if (settings.hover.rotate !== 0) tr.push(`rotate(${settings.hover.rotate}deg)`);
    if (tr.length > 0) lines.push(`    transform: ${tr.join(' ')};`);
    lines.push(`  }`);
  }

  // Focus state
  if (type === 'input' || type === 'textarea' || type === 'select') {
    lines.push(`\n  &:focus {`);
    lines.push(`    border-color: #8B5CF6;`);
    lines.push(`    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.25);`);
    lines.push(`  }`);
  }

  // Responsive mixins / media queries
  if (tabletSettings && Object.keys(tabletSettings).length > 0) {
    lines.push(`\n  @media (max-width: 768px) {`);
    if (tabletSettings.typography?.fontSize) lines.push(`    font-size: ${tabletSettings.typography.fontSize}px;`);
    if (tabletSettings.layout?.padding !== undefined) lines.push(`    padding: ${tabletSettings.layout.padding}px;`);
    if (tabletSettings.layout?.gap !== undefined) lines.push(`    gap: ${tabletSettings.layout.gap}px;`);
    if (tabletSettings.border?.radius !== undefined) lines.push(`    border-radius: ${tabletSettings.border.radius}px;`);
    lines.push(`  }`);
  }

  if (mobileSettings && Object.keys(mobileSettings).length > 0) {
    lines.push(`\n  @media (max-width: 480px) {`);
    if (mobileSettings.typography?.fontSize) lines.push(`    font-size: ${mobileSettings.typography.fontSize}px;`);
    if (mobileSettings.layout?.padding !== undefined) lines.push(`    padding: ${mobileSettings.layout.padding}px;`);
    if (mobileSettings.layout?.gap !== undefined) lines.push(`    gap: ${mobileSettings.layout.gap}px;`);
    if (mobileSettings.border?.radius !== undefined) lines.push(`    border-radius: ${mobileSettings.border.radius}px;`);
    lines.push(`  }`);
  }

  let fullScss = `${selector} {\n${lines.join('\n')}\n}`;

  if (settings.animation.preset && settings.animation.preset !== 'none') {
    const foundPreset = ANIMATION_PRESETS[settings.animation.preset];
    if (foundPreset && foundPreset.cssKeyframes) {
      fullScss += `\n\n${foundPreset.cssKeyframes}`;
    }
  }

  return fullScss;
}
