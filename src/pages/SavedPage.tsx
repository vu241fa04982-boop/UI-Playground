import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getSavedDesigns, deleteDesign } from '../utils/storage';
import { SavedDesign } from '../types/playground';
import { usePlayground } from '../context/PlaygroundContext';
import { TrashIcon, ExternalLinkIcon, BookmarkIcon, ArrowRightIcon } from '../components/icons';

export const SavedPage: React.FC = () => {
  const [designs, setDesigns] = useState<SavedDesign[]>([]);
  const { loadSavedDesign, showToast } = usePlayground();
  const navigate = useNavigate();

  useEffect(() => {
    setDesigns(getSavedDesigns());
  }, []);

  const handleOpen = (design: SavedDesign) => {
    loadSavedDesign(design);
    showToast(`Loaded "${design.name}" into Playground`, 'info');
    navigate('/playground');
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteDesign(id);
      setDesigns(getSavedDesigns());
      showToast(`Deleted "${name}"`, 'info');
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020817] text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header - Top-Right Create Design Button Removed */}
        <div className="pb-6 border-b border-slate-200 dark:border-[#12345C]/70">
          <div className="flex items-center gap-2 mb-1">
            <BookmarkIcon size={20} className="text-purple-600 dark:text-purple-400" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Saved Designs</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Manage and reload your saved CSS component configurations.
          </p>
        </div>

        {/* Empty State */}
        {designs.length === 0 ? (
          <div className="py-20 px-4 text-center max-w-md mx-auto space-y-5 bg-white dark:bg-[#0B1D3A]/40 border border-slate-200 dark:border-[#12345C]/60 rounded-3xl p-8 shadow-sm dark:shadow-none backdrop-blur-sm">
            <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-500/40 text-purple-700 dark:text-purple-300 mx-auto flex items-center justify-center">
              <BookmarkIcon size={28} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No saved designs yet.</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                You haven't saved any component configurations yet. Customize styles in the playground and click Save Design!
              </p>
            </div>
            <Link
              to="/playground"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold shadow-lg hover:scale-105 transition-all"
            >
              <span>Create your first design</span>
              <ArrowRightIcon size={14} />
            </Link>
          </div>
        ) : (
          /* Grid of Saved Design Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {designs.map((design) => {
              const bg =
                design.settings.color.bgType === 'linear-gradient'
                  ? `linear-gradient(${design.settings.color.gradientDirection}, ${design.settings.color.gradientColor1}, ${design.settings.color.gradientColor2})`
                  : design.settings.color.bgColor;

              return (
                <div
                  key={design.id}
                  className="bg-white dark:bg-[#0B1D3A] border border-slate-200 dark:border-[#12345C] hover:border-purple-400 dark:hover:border-purple-500/50 rounded-2xl p-5 shadow-sm dark:shadow-xl flex flex-col justify-between transition-all hover:-translate-y-1 group"
                >
                  <div className="space-y-4">
                    {/* Top bar with Name & Component tag */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                          {design.name}
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {formatDate(design.createdAt)}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#07152B] border border-slate-200 dark:border-[#12345C] text-purple-700 dark:text-purple-300">
                        {design.componentType}
                      </span>
                    </div>

                    {/* Miniature visual preview of the design */}
                    <div className="h-32 w-full rounded-xl bg-slate-100 dark:bg-[#020817] border border-slate-200 dark:border-[#12345C]/60 flex items-center justify-center p-3 relative overflow-hidden">
                      <div
                        style={{
                          background: bg,
                          borderRadius: `${Math.min(design.settings.border.radius, 20)}px`,
                          borderColor: design.settings.border.color,
                          borderWidth: `${design.settings.border.width}px`,
                          borderStyle: design.settings.border.style,
                          color: design.settings.color.textColor,
                        }}
                        className="w-3/4 h-20 shadow-md flex flex-col items-center justify-center p-2 text-center text-[10px] font-semibold truncate transform transition-transform group-hover:scale-105"
                      >
                        <span className="truncate max-w-full font-bold">
                          {design.settings.content.heading || design.name}
                        </span>
                        <span className="text-[9px] opacity-75 mt-0.5">
                          {design.settings.border.radius}px radius • {design.settings.typography.fontSize}px font
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Open & Delete */}
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-200 dark:border-[#12345C]/60">
                    <button
                      type="button"
                      onClick={() => handleDelete(design.id, design.name)}
                      className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      title="Delete design"
                    >
                      <TrashIcon size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpen(design)}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-600/30 hover:bg-purple-600 border border-purple-300 dark:border-purple-500/40 text-purple-700 dark:text-purple-200 hover:text-white text-xs font-semibold transition-all shadow-sm"
                    >
                      <ExternalLinkIcon size={14} />
                      <span>Open in Playground</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
