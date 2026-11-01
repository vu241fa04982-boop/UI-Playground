import React, { useState } from 'react';
import { usePlayground } from '../../context/PlaygroundContext';
import { SliderInput } from '../common/SliderInput';
import { ColorPicker } from '../common/ColorPicker';
import { ComponentSelector } from './ComponentSelector';
import { FONT_FAMILIES } from '../../data/fontFamilies';
import {
  CornerRadiusIcon,
  PaddingIcon,
  FontSizeIcon,
  DropIcon,
  ContrastIcon,
  ShadowIcon,
  SettingsIcon,
  ChevronDownIcon,
  LayersIcon,
  MoveIcon,
  SparklesIcon,
  RotateCcwIcon,
  BookmarkIcon,
  LinkIcon,
  UnlinkIcon,
  LockIcon,
  UnlockIcon,
  PauseIcon,
  PlayIcon,
} from '../icons';
import { ComponentType } from '../../types/playground';

interface StyleControlsProps {
  onOpenSaveModal: () => void;
}

type SectionName =
  | 'content'
  | 'advanced'
  | 'layout'
  | 'borders'
  | 'colors'
  | 'typography'
  | 'shadow'
  | 'transform'
  | 'hover'
  | 'transition'
  | 'animation';

const fieldClass =
  'w-full px-2.5 py-2 rounded-lg bg-[#020817] border border-[#12345C] text-slate-100 text-xs focus:outline-none focus:border-purple-500 transition-colors';

const labelClass = 'text-[11px] text-slate-400 block mb-1';

const SelectField: React.FC<{
  label: string;
  value: string | number;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
}> = ({ label, value, options, onChange }) => (
  <div className="min-w-0">
    <label className={labelClass}>{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={fieldClass}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const TextField: React.FC<{
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'number';
}> = ({ label, value, onChange, placeholder, type = 'text' }) => (
  <div className="min-w-0">
    <label className={labelClass}>{label}</label>
    <input
      type={type}
      value={value ?? ''}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={fieldClass}
    />
  </div>
);

export const StyleControls: React.FC<StyleControlsProps> = ({
  onOpenSaveModal,
}) => {
  const {
    selectedComponent,
    settings,
    isHeld,
    isLocked,
    toggleHold,
    toggleLock,
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
    resetCurrentSettings,
  } = usePlayground();

  const [openSections, setOpenSections] = useState<Record<SectionName, boolean>>({
    content: true,
    advanced: true,
    layout: false,
    borders: false,
    colors: false,
    typography: false,
    shadow: false,
    transform: false,
    hover: false,
    transition: false,
    animation: false,
  });

  const toggleSection = (section: SectionName) => {
    setOpenSections((previous) => ({
      ...previous,
      [section]: !previous[section],
    }));
  };

  const isDisabled = isHeld || isLocked;

  const hasHeading = [
    'card', 'alert', 'modal', 'accordion', 'notification',
    'profile-card', 'login-form', 'pricing-card', 'hero-section',
    'image-card',
  ].includes(selectedComponent);

  const hasDescription = [
    'card', 'alert', 'modal', 'tooltip', 'accordion',
    'profile-card', 'hero-section', 'image-card', 'notification',
  ].includes(selectedComponent);

  const hasButtonText = [
    'card', 'button', 'modal', 'profile-card',
    'login-form', 'pricing-card', 'hero-section',
  ].includes(selectedComponent);

  const hasBadgeText = [
    'badge', 'pricing-card',
  ].includes(selectedComponent);

  const hasLabel = [
    'checkbox', 'radio', 'toggle',
  ].includes(selectedComponent);

  const hasPlaceholder = [
    'input', 'textarea',
  ].includes(selectedComponent);

  const hasContentControls =
    hasHeading || hasDescription || hasButtonText ||
    hasBadgeText || hasLabel || hasPlaceholder;

  const SectionHeader: React.FC<{
    section: SectionName;
    title: string;
    icon?: React.ReactNode;
  }> = ({ section, title, icon }) => (
    <button
      type="button"
      onClick={() => toggleSection(section)}
      aria-expanded={openSections[section]}
      className="w-full px-3 py-2.5 flex items-center justify-between text-xs font-semibold text-slate-200 hover:text-white bg-[#07152B]/80 hover:bg-[#12345C]/40 transition-colors"
    >
      <span className="flex items-center gap-2">
        {icon}
        {title}
      </span>
      <ChevronDownIcon
        size={14}
        className={`text-slate-400 transition-transform ${
          openSections[section] ? 'rotate-180' : ''
        }`}
      />
    </button>
  );

  return (
    <div className="bg-[#0B1D3A] border border-[#12345C] rounded-2xl shadow-xl flex flex-col h-[calc(100vh-180px)] max-h-[calc(100vh-180px)] min-h-0 overflow-hidden">
      {/* Header */}
      <div className="shrink-0 p-4 border-b border-[#12345C]/70 bg-[#07152B]/60 space-y-3">
        <ComponentSelector />

        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h2 className="text-sm font-semibold text-slate-100">
            Style Controls
          </h2>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleHold}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                isHeld
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-[#12345C]/50 text-slate-300 border-[#12345C] hover:text-white'
              }`}
              title={isHeld ? 'Release controls' : 'Hold controls to edit CSS'}
            >
              {isHeld ? <PlayIcon size={12} /> : <PauseIcon size={12} />}
              {isHeld ? 'Release' : 'Hold'}
            </button>

            <button
              type="button"
              onClick={toggleLock}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                isLocked
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                  : 'bg-[#12345C]/50 text-slate-300 border-[#12345C] hover:text-white'
              }`}
              title={isLocked ? 'Unlock design' : 'Lock design'}
            >
              {isLocked ? <LockIcon size={12} /> : <UnlockIcon size={12} />}
              {isLocked ? 'Locked' : 'Lock'}
            </button>

            <button
              type="button"
              onClick={resetCurrentSettings}
              disabled={isLocked}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#12345C]/60 disabled:opacity-40 transition-colors"
              title="Reset settings"
            >
              <RotateCcwIcon size={14} />
            </button>

            <button
              type="button"
              onClick={onOpenSaveModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-semibold shadow-[0_0_12px_rgba(124,58,237,0.4)] transition-all active:scale-95"
            >
              <BookmarkIcon size={13} />
              Save
            </button>
          </div>
        </div>

        {isHeld && (
          <div className="px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px]">
            CSS editing mode is active. Release to use visual controls.
          </div>
        )}

        {isLocked && (
          <div className="px-3 py-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px] flex justify-between items-center">
            <span>Design is locked against changes.</span>
            <button
              type="button"
              onClick={toggleLock}
              className="underline font-semibold"
            >
              Unlock
            </button>
          </div>
        )}
      </div>

      {/* Controls */}
      <div
        className={`flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain p-4 space-y-3.5 scrollbar-thin transition-opacity ${
          isDisabled ? 'opacity-50 pointer-events-none' : ''
        }`}
      >
        {/* Main controls */}
        <div className="space-y-3 pb-3 border-b border-[#12345C]/60">
          <SliderInput
            icon={<CornerRadiusIcon size={16} />}
            label="Border Radius"
            value={settings.border.radius}
            onChange={(value) => updateBorder({
              radius: value,
              topLeft: value,
              topRight: value,
              bottomLeft: value,
              bottomRight: value,
            })}
            min={0}
            max={200}
            unit="px"
          />

          <SliderInput
            icon={<PaddingIcon size={16} />}
            label="Padding"
            value={settings.layout.padding}
            onChange={(value) => updateLayout({ padding: value })}
            min={0}
            max={150}
            unit="px"
          />

          <SliderInput
            icon={<FontSizeIcon size={16} />}
            label="Font Size"
            value={settings.typography.fontSize}
            onChange={(value) => updateTypography({ fontSize: value })}
            min={10}
            max={72}
            unit="px"
          />

          <ColorPicker
            icon={<DropIcon size={16} />}
            label="Background Color"
            value={settings.color.bgColor}
            onChange={(color) => updateColor({
              bgColor: color,
              bgType: 'solid',
            })}
            showPresets
          />

          <ColorPicker
            icon={<ContrastIcon size={16} />}
            label="Text Color"
            value={settings.color.textColor}
            onChange={(color) => updateColor({ textColor: color })}
            showPresets
          />

          <SliderInput
            icon={<ShadowIcon size={16} />}
            label="Shadow Blur"
            value={settings.shadow.blur}
            onChange={(value) => updateShadow({ blur: value })}
            min={0}
            max={100}
            unit="px"
          />
        </div>

        {/* Content */}
        {hasContentControls && (
          <div className="border border-[#12345C]/60 rounded-xl bg-[#07152B]/40 overflow-hidden">
            <SectionHeader
              section="content"
              title="Content & Text"
              icon={<span className="text-cyan-400">Aa</span>}
            />

            {openSections.content && (
              <div className="p-3 space-y-3">
                {hasHeading && (
                  <TextField
                    label="Heading"
                    value={settings.content.heading}
                    placeholder="Enter heading"
                    onChange={(value) => updateContent({ heading: value })}
                  />
                )}

                {hasDescription && (
                  <div>
                    <label className={labelClass}>Description</label>
                    <textarea
                      rows={3}
                      value={settings.content.description}
                      placeholder="Enter description"
                      onChange={(e) => updateContent({
                        description: e.target.value,
                      })}
                      className={`${fieldClass} resize-y`}
                    />
                  </div>
                )}

                {hasButtonText && (
                  <TextField
                    label="Button Text"
                    value={settings.content.buttonText}
                    placeholder="Enter button text"
                    onChange={(value) => updateContent({
                      buttonText: value,
                    })}
                  />
                )}

                {hasBadgeText && (
                  <TextField
                    label="Badge Text"
                    value={settings.content.badgeText}
                    placeholder="Enter badge text"
                    onChange={(value) => updateContent({
                      badgeText: value,
                    })}
                  />
                )}

                {hasLabel && (
                  <TextField
                    label="Label"
                    value={settings.content.label}
                    placeholder="Enter label"
                    onChange={(value) => updateContent({ label: value })}
                  />
                )}

                {hasPlaceholder && (
                  <TextField
                    label="Placeholder"
                    value={settings.content.placeholder}
                    placeholder="Enter placeholder"
                    onChange={(value) => updateContent({
                      placeholder: value,
                    })}
                  />
                )}
              </div>
            )}
          </div>
        )}

        {/* Advanced controls */}
        <div className="border border-[#12345C]/80 rounded-xl bg-[#07152B]/40 overflow-hidden">
          <SectionHeader
            section="advanced"
            title="Advanced Controls"
            icon={<SettingsIcon size={15} className="text-purple-400" />}
          />

          {openSections.advanced && (
            <div className="p-2 space-y-2 border-t border-[#12345C]/50">

              {/* Layout */}
              <div className="border border-[#12345C]/50 rounded-lg overflow-hidden">
                <SectionHeader
                  section="layout"
                  title="Layout & Sizing"
                  icon={<LayersIcon size={14} className="text-blue-400" />}
                />

                {openSections.layout && (
                  <div className="p-3 bg-[#020817]/60 space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <TextField
                        label="Width"
                        value={settings.layout.width}
                        onChange={(value) => updateLayout({ width: value })}
                        placeholder="100%"
                      />
                      <TextField
                        label="Height"
                        value={settings.layout.height}
                        onChange={(value) => updateLayout({ height: value })}
                        placeholder="auto"
                      />
                      <TextField
                        label="Min Width"
                        value={settings.layout.minWidth}
                        onChange={(value) => updateLayout({ minWidth: value })}
                        placeholder="auto"
                      />
                      <TextField
                        label="Max Width"
                        value={settings.layout.maxWidth}
                        onChange={(value) => updateLayout({ maxWidth: value })}
                        placeholder="none"
                      />
                      <TextField
                        label="Min Height"
                        value={settings.layout.minHeight}
                        onChange={(value) => updateLayout({ minHeight: value })}
                        placeholder="auto"
                      />
                      <TextField
                        label="Max Height"
                        value={settings.layout.maxHeight}
                        onChange={(value) => updateLayout({ maxHeight: value })}
                        placeholder="none"
                      />
                    </div>

                    <SliderInput
                      label="Margin"
                      value={settings.layout.margin}
                      onChange={(value) => updateLayout({ margin: value })}
                      min={0}
                      max={100}
                      unit="px"
                    />

                    <SliderInput
                      label="Gap Spacing"
                      value={settings.layout.gap}
                      onChange={(value) => updateLayout({ gap: value })}
                      min={0}
                      max={80}
                      unit="px"
                    />

                    <SelectField
                      label="Display"
                      value={settings.layout.display}
                      onChange={(value) => updateLayout({ display: value as any })}
                      options={[
                        { label: 'Flex', value: 'flex' },
                        { label: 'Inline Flex', value: 'inline-flex' },
                        { label: 'Block', value: 'block' },
                        { label: 'Grid', value: 'grid' },
                      ]}
                    />

                    <SelectField
                      label="Flex Direction"
                      value={settings.layout.flexDirection}
                      onChange={(value) => updateLayout({ flexDirection: value as any })}
                      options={[
                        { label: 'Column', value: 'column' },
                        { label: 'Row', value: 'row' },
                        { label: 'Column Reverse', value: 'column-reverse' },
                        { label: 'Row Reverse', value: 'row-reverse' },
                      ]}
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <SelectField
                        label="Align Items"
                        value={settings.layout.alignItems}
                        onChange={(value) => updateLayout({ alignItems: value as any })}
                        options={[
                          { label: 'Stretch', value: 'stretch' },
                          { label: 'Center', value: 'center' },
                          { label: 'Start', value: 'flex-start' },
                          { label: 'End', value: 'flex-end' },
                        ]}
                      />

                      <SelectField
                        label="Justify Content"
                        value={settings.layout.justifyContent}
                        onChange={(value) => updateLayout({ justifyContent: value as any })}
                        options={[
                          { label: 'Start', value: 'flex-start' },
                          { label: 'Center', value: 'center' },
                          { label: 'End', value: 'flex-end' },
                          { label: 'Space Between', value: 'space-between' },
                          { label: 'Space Around', value: 'space-around' },
                          { label: 'Space Evenly', value: 'space-evenly' },
                        ]}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Borders */}
              <div className="border border-[#12345C]/50 rounded-lg overflow-hidden">
                <SectionHeader
                  section="borders"
                  title="Borders & Corners"
                  icon={<CornerRadiusIcon size={14} className="text-purple-400" />}
                />

                {openSections.borders && (
                  <div className="p-3 bg-[#020817]/60 space-y-3">
                    <button
                      type="button"
                      onClick={() => updateBorder({
                        linkedCorners: !settings.border.linkedCorners,
                      })}
                      className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs border transition-colors ${
                        settings.border.linkedCorners
                          ? 'bg-purple-600/30 text-purple-200 border-purple-500/50'
                          : 'bg-[#07152B] text-slate-300 border-[#12345C]'
                      }`}
                    >
                      {settings.border.linkedCorners
                        ? <LinkIcon size={13} />
                        : <UnlinkIcon size={13} />}
                      {settings.border.linkedCorners
                        ? 'Corners Linked'
                        : 'Corners Separate'}
                    </button>

                    {settings.border.linkedCorners ? (
                      <SliderInput
                        label="Unified Radius"
                        value={settings.border.radius}
                        onChange={(value) => updateBorder({ radius: value })}
                        min={0}
                        max={200}
                        unit="px"
                      />
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        <SliderInput
                          label="Top Left"
                          value={settings.border.topLeft}
                          onChange={(value) => updateBorder({ topLeft: value })}
                          min={0}
                          max={200}
                          unit="px"
                        />
                        <SliderInput
                          label="Top Right"
                          value={settings.border.topRight}
                          onChange={(value) => updateBorder({ topRight: value })}
                          min={0}
                          max={200}
                          unit="px"
                        />
                        <SliderInput
                          label="Bottom Left"
                          value={settings.border.bottomLeft}
                          onChange={(value) => updateBorder({ bottomLeft: value })}
                          min={0}
                          max={200}
                          unit="px"
                        />
                        <SliderInput
                          label="Bottom Right"
                          value={settings.border.bottomRight}
                          onChange={(value) => updateBorder({ bottomRight: value })}
                          min={0}
                          max={200}
                          unit="px"
                        />
                      </div>
                    )}

                    <SliderInput
                      label="Border Width"
                      value={settings.border.width}
                      onChange={(value) => updateBorder({ width: value })}
                      min={0}
                      max={16}
                      unit="px"
                    />

                    <SelectField
                      label="Border Style"
                      value={settings.border.style}
                      onChange={(value) => updateBorder({ style: value as any })}
                      options={[
                        { label: 'Solid', value: 'solid' },
                        { label: 'Dashed', value: 'dashed' },
                        { label: 'Dotted', value: 'dotted' },
                        { label: 'Double', value: 'double' },
                        { label: 'None', value: 'none' },
                      ]}
                    />

                    <ColorPicker
                      label="Border Color"
                      value={settings.border.color}
                      onChange={(color) => updateBorder({ color })}
                      showPresets
                    />
                  </div>
                )}
              </div>

              {/* Colors */}
              <div className="border border-[#12345C]/50 rounded-lg overflow-hidden">
                <SectionHeader
                  section="colors"
                  title="Colors & Gradients"
                  icon={<DropIcon size={14} className="text-pink-400" />}
                />

                {openSections.colors && (
                  <div className="p-3 bg-[#020817]/60 space-y-3">
                    <div className="grid grid-cols-3 gap-1 p-1 rounded-lg bg-[#07152B]">
                      {[
                        { label: 'Solid', value: 'solid' },
                        { label: 'Linear', value: 'linear-gradient' },
                        { label: 'Radial', value: 'radial-gradient' },
                      ].map((item) => (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => updateColor({ bgType: item.value as any })}
                          className={`py-2 rounded-md text-[11px] transition-colors ${
                            settings.color.bgType === item.value
                              ? 'bg-purple-600 text-white'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>

                    {settings.color.bgType === 'solid' ? (
                      <ColorPicker
                        label="Background"
                        value={settings.color.bgColor}
                        onChange={(color) => updateColor({ bgColor: color })}
                        showPresets
                      />
                    ) : (
                      <>
                        <ColorPicker
                          label="Gradient Start"
                          value={settings.color.gradientColor1}
                          onChange={(color) => updateColor({ gradientColor1: color })}
                          showPresets
                        />

                        <ColorPicker
                          label="Gradient End"
                          value={settings.color.gradientColor2}
                          onChange={(color) => updateColor({ gradientColor2: color })}
                          showPresets
                        />

                        <SelectField
                          label="Gradient Direction"
                          value={settings.color.gradientDirection}
                          onChange={(value) => updateColor({ gradientDirection: value })}
                          options={[
                            { label: 'Diagonal 135°', value: '135deg' },
                            { label: 'Left to Right 90°', value: '90deg' },
                            { label: 'Top to Bottom 180°', value: '180deg' },
                            { label: 'Diagonal 45°', value: '45deg' },
                          ]}
                        />
                      </>
                    )}

                    <ColorPicker
                      label="Text Color"
                      value={settings.color.textColor}
                      onChange={(color) => updateColor({ textColor: color })}
                      showPresets
                    />

                    <SliderInput
                      label="Opacity"
                      value={settings.color.opacity}
                      onChange={(value) => updateColor({ opacity: value })}
                      min={0}
                      max={100}
                      unit="%"
                    />
                  </div>
                )}
              </div>

              {/* Typography */}
              <div className="border border-[#12345C]/50 rounded-lg overflow-hidden">
                <SectionHeader
                  section="typography"
                  title="Typography"
                  icon={<FontSizeIcon size={14} className="text-cyan-400" />}
                />

                {openSections.typography && (
                  <div className="p-3 bg-[#020817]/60 space-y-3">
                    <SelectField
                      label="Font Family"
                      value={settings.typography.fontFamily}
                      onChange={(value) => updateTypography({ fontFamily: value })}
                      options={FONT_FAMILIES.map((font) => ({
                        label: font.name,
                        value: font.value,
                      }))}
                    />

                    <SelectField
                      label="Font Weight"
                      value={settings.typography.fontWeight}
                      onChange={(value) => updateTypography({ fontWeight: value })}
                      options={[
                        { label: 'Light 300', value: '300' },
                        { label: 'Regular 400', value: '400' },
                        { label: 'Medium 500', value: '500' },
                        { label: 'Semibold 600', value: '600' },
                        { label: 'Bold 700', value: '700' },
                        { label: 'Extra Bold 800', value: '800' },
                      ]}
                    />

                    <SelectField
                      label="Text Alignment"
                      value={settings.typography.textAlign}
                      onChange={(value) => updateTypography({ textAlign: value as any })}
                      options={[
                        { label: 'Left', value: 'left' },
                        { label: 'Center', value: 'center' },
                        { label: 'Right', value: 'right' },
                        { label: 'Justify', value: 'justify' },
                      ]}
                    />

                    <SelectField
                      label="Text Transform"
                      value={settings.typography.textTransform}
                      onChange={(value) => updateTypography({ textTransform: value as any })}
                      options={[
                        { label: 'None', value: 'none' },
                        { label: 'Uppercase', value: 'uppercase' },
                        { label: 'Lowercase', value: 'lowercase' },
                        { label: 'Capitalize', value: 'capitalize' },
                      ]}
                    />

                    <SelectField
                      label="Text Decoration"
                      value={settings.typography.textDecoration}
                      onChange={(value) => updateTypography({ textDecoration: value as any })}
                      options={[
                        { label: 'None', value: 'none' },
                        { label: 'Underline', value: 'underline' },
                        { label: 'Overline', value: 'overline' },
                        { label: 'Line Through', value: 'line-through' },
                      ]}
                    />

                    <SliderInput
                      label="Line Height"
                      value={settings.typography.lineHeight}
                      onChange={(value) => updateTypography({ lineHeight: value })}
                      min={0.8}
                      max={3}
                      step={0.1}
                    />

                    <SliderInput
                      label="Letter Spacing"
                      value={settings.typography.letterSpacing}
                      onChange={(value) => updateTypography({ letterSpacing: value })}
                      min={-2}
                      max={12}
                      unit="px"
                    />
                  </div>
                )}
              </div>

              {/* Shadow */}
              <div className="border border-[#12345C]/50 rounded-lg overflow-hidden">
                <SectionHeader
                  section="shadow"
                  title="Shadow & Glow"
                  icon={<ShadowIcon size={14} className="text-violet-400" />}
                />

                {openSections.shadow && (
                  <div className="p-3 bg-[#020817]/60 space-y-3">
                    <SliderInput
                      label="Horizontal Offset"
                      value={settings.shadow.x}
                      onChange={(value) => updateShadow({ x: value })}
                      min={-50}
                      max={50}
                      unit="px"
                    />

                    <SliderInput
                      label="Vertical Offset"
                      value={settings.shadow.y}
                      onChange={(value) => updateShadow({ y: value })}
                      min={-50}
                      max={50}
                      unit="px"
                    />

                    <SliderInput
                      label="Blur"
                      value={settings.shadow.blur}
                      onChange={(value) => updateShadow({ blur: value })}
                      min={0}
                      max={100}
                      unit="px"
                    />

                    <SliderInput
                      label="Spread"
                      value={settings.shadow.spread}
                      onChange={(value) => updateShadow({ spread: value })}
                      min={-30}
                      max={50}
                      unit="px"
                    />

                    <ColorPicker
                      label="Shadow Color"
                      value={settings.shadow.color}
                      onChange={(color) => updateShadow({ color })}
                      showPresets
                    />

                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <label htmlFor="shadow-inset">Inset Shadow</label>
                      <input
                        id="shadow-inset"
                        type="checkbox"
                        checked={settings.shadow.inset}
                        onChange={(e) => updateShadow({ inset: e.target.checked })}
                        className="accent-purple-600 w-4 h-4"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Transform */}
              <div className="border border-[#12345C]/50 rounded-lg overflow-hidden">
                <SectionHeader
                  section="transform"
                  title="Transform & Scale"
                  icon={<MoveIcon size={14} className="text-amber-400" />}
                />

                {openSections.transform && (
                  <div className="p-3 bg-[#020817]/60 space-y-3">
                    <SliderInput
                      label="Translate X"
                      value={settings.transform.translateX}
                      onChange={(value) => updateTransform({ translateX: value })}
                      min={-150}
                      max={150}
                      unit="px"
                    />

                    <SliderInput
                      label="Translate Y"
                      value={settings.transform.translateY}
                      onChange={(value) => updateTransform({ translateY: value })}
                      min={-150}
                      max={150}
                      unit="px"
                    />

                    <SliderInput
                      label="Scale"
                      value={Math.round(settings.transform.scale * 100)}
                      onChange={(value) => updateTransform({ scale: value / 100 })}
                      min={50}
                      max={150}
                      unit="%"
                    />

                    <SliderInput
                      label="Rotate"
                      value={settings.transform.rotate}
                      onChange={(value) => updateTransform({ rotate: value })}
                      min={-180}
                      max={180}
                      unit="°"
                    />

                    <SliderInput
                      label="Skew X"
                      value={settings.transform.skewX}
                      onChange={(value) => updateTransform({ skewX: value })}
                      min={-45}
                      max={45}
                      unit="°"
                    />

                    <SliderInput
                      label="Skew Y"
                      value={settings.transform.skewY}
                      onChange={(value) => updateTransform({ skewY: value })}
                      min={-45}
                      max={45}
                      unit="°"
                    />
                  </div>
                )}
              </div>

              {/* Hover */}
              <div className="border border-[#12345C]/50 rounded-lg overflow-hidden">
                <SectionHeader
                  section="hover"
                  title="Hover Effects"
                  icon={<SparklesIcon size={14} className="text-purple-400" />}
                />

                {openSections.hover && (
                  <div className="p-3 bg-[#020817]/60 space-y-3">
                    <label className="flex items-center justify-between text-xs text-slate-300">
                      Enable Hover Effects
                      <input
                        type="checkbox"
                        checked={settings.hover.enabled}
                        onChange={(e) => updateHover({ enabled: e.target.checked })}
                        className="w-4 h-4 accent-purple-600"
                      />
                    </label>

                    {settings.hover.enabled && (
                      <>
                        <SliderInput
                          label="Hover Scale"
                          value={Math.round(settings.hover.scale * 100)}
                          onChange={(value) => updateHover({ scale: value / 100 })}
                          min={70}
                          max={140}
                          unit="%"
                        />

                        <SliderInput
                          label="Hover Lift"
                          value={settings.hover.translateY}
                          onChange={(value) => updateHover({ translateY: value })}
                          min={-40}
                          max={40}
                          unit="px"
                        />

                        <SliderInput
                          label="Hover Rotation"
                          value={settings.hover.rotate}
                          onChange={(value) => updateHover({ rotate: value })}
                          min={-30}
                          max={30}
                          unit="°"
                        />

                        <ColorPicker
                          label="Hover Background"
                          value={settings.hover.bgColor}
                          onChange={(color) => updateHover({ bgColor: color })}
                          showPresets
                        />

                        <ColorPicker
                          label="Hover Text Color"
                          value={settings.hover.textColor}
                          onChange={(color) => updateHover({ textColor: color })}
                          showPresets
                        />

                        <ColorPicker
                          label="Hover Border Color"
                          value={settings.hover.borderColor}
                          onChange={(color) => updateHover({ borderColor: color })}
                          showPresets
                        />

                        <SliderInput
                          label="Hover Glow Blur"
                          value={settings.hover.shadowBlur}
                          onChange={(value) => updateHover({ shadowBlur: value })}
                          min={0}
                          max={80}
                          unit="px"
                        />

                        <ColorPicker
                          label="Hover Glow Color"
                          value={settings.hover.shadowColor}
                          onChange={(color) => updateHover({ shadowColor: color })}
                          showPresets
                        />
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Transition */}
              <div className="border border-[#12345C]/50 rounded-lg overflow-hidden">
                <SectionHeader
                  section="transition"
                  title="Transitions"
                  icon={<SparklesIcon size={14} className="text-cyan-400" />}
                />

                {openSections.transition && (
                  <div className="p-3 bg-[#020817]/60 space-y-3">
                    <SelectField
                      label="Property"
                      value={settings.transition.property}
                      onChange={(value) => updateTransition({ property: value })}
                      options={[
                        { label: 'All', value: 'all' },
                        { label: 'Transform', value: 'transform' },
                        { label: 'Opacity', value: 'opacity' },
                        { label: 'Background Color', value: 'background-color' },
                        { label: 'Border Color', value: 'border-color' },
                        { label: 'Box Shadow', value: 'box-shadow' },
                      ]}
                    />

                    <SelectField
                      label="Timing Function"
                      value={settings.transition.timingFunction}
                      onChange={(value) => updateTransition({ timingFunction: value as any })}
                      options={[
                        { label: 'Ease', value: 'ease' },
                        { label: 'Linear', value: 'linear' },
                        { label: 'Ease In', value: 'ease-in' },
                        { label: 'Ease Out', value: 'ease-out' },
                        { label: 'Ease In Out', value: 'ease-in-out' },
                      ]}
                    />

                    <SliderInput
                      label="Duration"
                      value={settings.transition.duration}
                      onChange={(value) => updateTransition({ duration: value })}
                      min={0}
                      max={2000}
                      step={50}
                      unit="ms"
                    />
                  </div>
                )}
              </div>

              {/* Animation */}
              <div className="border border-[#12345C]/50 rounded-lg overflow-hidden">
                <SectionHeader
                  section="animation"
                  title="Animations"
                  icon={<SparklesIcon size={14} className="text-emerald-400" />}
                />

                {openSections.animation && (
                  <div className="p-3 bg-[#020817]/60 space-y-3">
                    <SelectField
                      label="Animation Preset"
                      value={settings.animation.preset}
                      onChange={(value) => updateAnimation({ preset: value as any })}
                      options={[
                        { label: 'None', value: 'none' },
                        { label: 'Fade In', value: 'fade-in' },
                        { label: 'Fade Up', value: 'fade-up' },
                        { label: 'Fade Down', value: 'fade-down' },
                        { label: 'Slide Up', value: 'slide-up' },
                        { label: 'Slide Down', value: 'slide-down' },
                        { label: 'Slide Left', value: 'slide-left' },
                        { label: 'Slide Right', value: 'slide-right' },
                        { label: 'Scale In', value: 'scale-in' },
                        { label: 'Zoom In', value: 'zoom-in' },
                        { label: 'Zoom Out', value: 'zoom-out' },
                        { label: 'Bounce', value: 'bounce' },
                        { label: 'Pulse', value: 'pulse' },
                        { label: 'Float', value: 'float' },
                        { label: 'Glow', value: 'glow' },
                        { label: 'Shake', value: 'shake' },
                        { label: 'Rotate', value: 'rotate' },
                        { label: 'Swing', value: 'swing' },
                        { label: 'Wiggle', value: 'wiggle' },
                        { label: 'Heartbeat', value: 'heartbeat' },
                        { label: 'Shimmer', value: 'shimmer' },
                      ]}
                    />

                    {settings.animation.preset !== 'none' && (
                      <>
                        <SliderInput
                          label="Duration"
                          value={settings.animation.duration}
                          onChange={(value) => updateAnimation({ duration: value })}
                          min={200}
                          max={5000}
                          step={100}
                          unit="ms"
                        />

                        <SliderInput
                          label="Delay"
                          value={settings.animation.delay}
                          onChange={(value) => updateAnimation({ delay: value })}
                          min={0}
                          max={3000}
                          step={100}
                          unit="ms"
                        />

                        <SelectField
                          label="Timing Function"
                          value={settings.animation.timingFunction}
                          onChange={(value) => updateAnimation({ timingFunction: value as any })}
                          options={[
                            { label: 'Ease', value: 'ease' },
                            { label: 'Linear', value: 'linear' },
                            { label: 'Ease In', value: 'ease-in' },
                            { label: 'Ease Out', value: 'ease-out' },
                            { label: 'Ease In Out', value: 'ease-in-out' },
                          ]}
                        />

                        <SelectField
                          label="Iteration Count"
                          value={settings.animation.iterationCount}
                          onChange={(value) => updateAnimation({ iterationCount: value as any })}
                          options={[
                            { label: 'Infinite', value: 'infinite' },
                            { label: 'Once', value: '1' },
                            { label: 'Twice', value: '2' },
                            { label: 'Three Times', value: '3' },
                          ]}
                        />

                        <SelectField
                          label="Direction"
                          value={settings.animation.direction}
                          onChange={(value) => updateAnimation({ direction: value as any })}
                          options={[
                            { label: 'Normal', value: 'normal' },
                            { label: 'Reverse', value: 'reverse' },
                            { label: 'Alternate', value: 'alternate' },
                            { label: 'Alternate Reverse', value: 'alternate-reverse' },
                          ]}
                        />

                        <SelectField
                          label="Fill Mode"
                          value={settings.animation.fillMode || 'both'}
                          onChange={(value) => updateAnimation({ fillMode: value as any })}
                          options={[
                            { label: 'Both', value: 'both' },
                            { label: 'Forwards', value: 'forwards' },
                            { label: 'Backwards', value: 'backwards' },
                            { label: 'None', value: 'none' },
                          ]}
                        />
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};