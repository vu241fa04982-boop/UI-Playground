import React, { useState } from 'react';
import { usePlayground } from '../../context/PlaygroundContext';
import { COMPONENT_LIST } from '../../data/initialComponents';
import { ComponentCategory, ComponentType } from '../../types/playground';
import { CardIcon, ButtonIcon, InputIcon, ChevronDownIcon, SearchIcon, SparklesIcon } from '../icons';

export const ComponentSelector: React.FC = () => {
  const { selectedComponent, selectComponent } = usePlayground();
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<ComponentCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const quickTypes: { type: ComponentType; label: string; icon: React.ReactNode }[] = [
    { type: 'card', label: 'Card', icon: <CardIcon size={15} /> },
    { type: 'button', label: 'Button', icon: <ButtonIcon size={15} /> },
    { type: 'input', label: 'Input', icon: <InputIcon size={15} /> },
  ];

  const filteredComponents = COMPONENT_LIST.filter((comp) => {
    const matchesCategory = activeCategory === 'all' || comp.category === activeCategory;
    const matchesSearch = comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          comp.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const selectedMeta = COMPONENT_LIST.find((c) => c.type === selectedComponent);

  return (
    <div className="space-y-3 pb-3 border-b border-slate-200 dark:border-[#12345C]/60">
      {/* Quick selection tabs matching reference image */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
        {quickTypes.map((item) => {
          const isActive = selectedComponent === item.type;
          return (
            <button
              key={item.type}
              type="button"
              onClick={() => selectComponent(item.type)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_0_12px_rgba(124,58,237,0.4)]'
                  : 'bg-slate-100 dark:bg-[#07152B] border border-slate-300 dark:border-[#12345C] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-slate-600'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}

        {/* Expand library button */}
        <button
          type="button"
          onClick={() => setIsLibraryOpen(!isLibraryOpen)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ml-auto ${
            isLibraryOpen || !quickTypes.some((q) => q.type === selectedComponent)
              ? 'bg-purple-100 dark:bg-purple-900/60 border border-purple-300 dark:border-purple-500/60 text-purple-700 dark:text-purple-200'
              : 'bg-slate-100 dark:bg-[#07152B] border border-slate-300 dark:border-[#12345C] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
          title="Browse all 26 components"
        >
          <SparklesIcon size={14} className="text-cyan-500 dark:text-cyan-400" />
          <span className="hidden sm:inline">
            {selectedMeta && !quickTypes.some((q) => q.type === selectedComponent)
              ? selectedMeta.name
              : 'More'}
          </span>
          <ChevronDownIcon size={14} className={`transform transition-transform ${isLibraryOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Expanded Library Drawer */}
      {isLibraryOpen && (
        <div className="p-3 rounded-xl bg-white dark:bg-[#07152B] border border-slate-200 dark:border-[#12345C] shadow-2xl space-y-3 animate-fade-in">
          <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-200 dark:border-[#12345C]/50">
            <span className="font-semibold text-slate-800 dark:text-slate-200">Component Library ({COMPONENT_LIST.length})</span>
            <button
              onClick={() => setIsLibraryOpen(false)}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <SearchIcon size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search components..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#020817] border border-slate-300 dark:border-[#12345C] text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex gap-1 text-[11px]">
            {(['all', 'basic', 'ui', 'advanced'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 rounded-md capitalize transition-colors ${
                  activeCategory === cat
                    ? 'bg-purple-600 text-white font-medium'
                    : 'bg-slate-100 dark:bg-[#0B1D3A] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Component list grid */}
          <div className="max-h-56 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
            {filteredComponents.map((comp) => {
              const isSelected = selectedComponent === comp.type;
              return (
                <button
                  key={comp.type}
                  type="button"
                  onClick={() => {
                    selectComponent(comp.type);
                    setIsLibraryOpen(false);
                  }}
                  className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-purple-100 dark:bg-purple-900/60 border border-purple-400 dark:border-purple-500/50 text-purple-900 dark:text-white'
                      : 'hover:bg-slate-100 dark:hover:bg-[#0B1D3A] text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div>
                    <div className="font-medium text-slate-800 dark:text-slate-200">{comp.name}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">{comp.description}</div>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#020817] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-[#12345C]">
                    {comp.category}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
