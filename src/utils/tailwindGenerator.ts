import { ComponentSettings, ComponentType } from '../types/playground';

export function generateTailwind(
  type: ComponentType,
  settings: ComponentSettings
): string {
  const classes: string[] = [];

  // Display & Flex
  if (settings.layout.display === 'flex') classes.push('flex');
  else if (settings.layout.display === 'inline-flex') classes.push('inline-flex');
  else if (settings.layout.display === 'grid') classes.push('grid');
  else if (settings.layout.display === 'block') classes.push('block');

  if (settings.layout.display.includes('flex')) {
    if (settings.layout.flexDirection === 'column') classes.push('flex-col');
    if (settings.layout.flexDirection === 'row-reverse') classes.push('flex-row-reverse');
    if (settings.layout.flexDirection === 'column-reverse') classes.push('flex-col-reverse');

    if (settings.layout.justifyContent === 'center') classes.push('justify-center');
    else if (settings.layout.justifyContent === 'space-between') classes.push('justify-between');
    else if (settings.layout.justifyContent === 'flex-end') classes.push('justify-end');

    if (settings.layout.alignItems === 'center') classes.push('items-center');
    else if (settings.layout.alignItems === 'flex-end') classes.push('items-end');
    else if (settings.layout.alignItems === 'stretch') classes.push('items-stretch');

    if (settings.layout.gap) classes.push(`gap-[${settings.layout.gap}px]`);
  }

  // Sizing
  if (settings.layout.width === '100%') classes.push('w-full');
  else if (settings.layout.width === 'auto') classes.push('w-auto');
  else if (settings.layout.width) classes.push(`w-[${settings.layout.width}]`);

  if (settings.layout.maxWidth && settings.layout.maxWidth !== 'none') {
    classes.push(`max-w-[${settings.layout.maxWidth}]`);
  }

  // Padding
  if (settings.layout.padding !== undefined) {
    classes.push(`p-[${settings.layout.padding}px]`);
  }

  // Background
  if (settings.color.bgType === 'solid') {
    classes.push(`bg-[${settings.color.bgColor}]`);
  } else if (settings.color.bgType === 'linear-gradient') {
    classes.push(`bg-gradient-to-br ${'from-[' + settings.color.gradientColor1 + ']'} ${'to-[' + settings.color.gradientColor2 + ']'}`);
  }

  // Text color & typography
  classes.push(`text-[${settings.color.textColor}]`);
  if (settings.typography.fontSize) classes.push(`text-[${settings.typography.fontSize}px]`);
  if (settings.typography.fontWeight === '700' || settings.typography.fontWeight === 'bold') classes.push('font-bold');
  else if (settings.typography.fontWeight === '600') classes.push('font-semibold');
  else if (settings.typography.fontWeight === '500') classes.push('font-medium');
  if (settings.typography.textAlign) classes.push(`text-${settings.typography.textAlign}`);

  // Borders
  if (settings.border.linkedCorners) {
    if (settings.border.radius === 9999) classes.push('rounded-full');
    else classes.push(`rounded-[${settings.border.radius}px]`);
  } else {
    classes.push(
      `rounded-tl-[${settings.border.topLeft}px] rounded-tr-[${settings.border.topRight}px] rounded-br-[${settings.border.bottomRight}px] rounded-bl-[${settings.border.bottomLeft}px]`
    );
  }

  if (settings.border.width > 0 && settings.border.style !== 'none') {
    classes.push(`border-[${settings.border.width}px]`);
    classes.push(`border-[${settings.border.color}]`);
    if (settings.border.style === 'dashed') classes.push('border-dashed');
    if (settings.border.style === 'dotted') classes.push('border-dotted');
  }

  // Shadow
  const shadow = settings.shadow;
  if (shadow.blur > 0 || shadow.spread > 0 || shadow.y !== 0) {
    classes.push(`shadow-[${shadow.x}px_${shadow.y}px_${shadow.blur}px_${shadow.color.replace(/\s+/g, '')}]`);
  }

  // Transition
  if (settings.transition.duration > 0) {
    classes.push(`transition-all duration-[${settings.transition.duration}ms] ease-in-out`);
  }

  // Hover
  if (settings.hover.enabled) {
    if (settings.hover.bgColor) classes.push(`hover:bg-[${settings.hover.bgColor}]`);
    if (settings.hover.textColor) classes.push(`hover:text-[${settings.hover.textColor}]`);
    if (settings.hover.borderColor) classes.push(`hover:border-[${settings.hover.borderColor}]`);
    if (settings.hover.scale !== 1) classes.push('hover:' + 'scale-[' + settings.hover.scale + ']');
    if (settings.hover.translateY !== 0) classes.push(`hover:-translate-y-[${Math.abs(settings.hover.translateY)}px]`);
  }

  return `<!-- ${type} Tailwind Classes -->\n<div className="${classes.join(' ')}">\n  <!-- Content here -->\n</div>`;
}
