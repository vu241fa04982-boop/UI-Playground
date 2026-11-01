
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getSavedDesigns, deleteDesign } from '../utils/storage';
import { SavedDesign } from '../types/playground';
import { usePlayground } from '../context/PlaygroundContext';
import { ComponentRenderer } from '../components/playground/ComponentRenderer';
import {
  TrashIcon,
  ExternalLinkIcon,
  BookmarkIcon,
  ArrowRightIcon,
} from '../components/icons';

export const SavedPage: React.FC = () => {
  const [designs, setDesigns] = useState<SavedDesign[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { loadSavedDesign, showToast } = usePlayground();
  const navigate = useNavigate();

  const loadDesigns = async () => {
    try {
      setLoading(true);
      const saved = await getSavedDesigns();
      setDesigns(saved);
    } catch (error) {
      console.error('Failed to load saved designs:', error);
      showToast(
        error instanceof Error ? error.message : 'Unable to load saved designs.',
        'info'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDesigns();
  }, []);

  const handleOpen = (design: SavedDesign) => {
    loadSavedDesign(design);
    showToast(`Loaded "${design.name}" into Playground`, 'info');
    navigate('/playground');
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteDesign(id);

      setDesigns((current) => current.filter((item) => item.id !== id));
      showToast(`Deleted "${name}"`, 'success');
    } catch (error) {
      console.error('Failed to delete design:', error);
      showToast(
        error instanceof Error ? error.message : 'Unable to delete design.',
        'info'
      );
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);

    if (Number.isNaN(date.getTime())) {
      return 'Recently';
    }

    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020817] text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="pb-6 border-b border-slate-200 dark:border-[#12345C]/70">
          <div className="flex items-center gap-2 mb-1">
            <BookmarkIcon size={20} className="text-purple-600 dark:text-purple-400" />

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Saved Designs
            </h1>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Manage and reload your saved CSS component configurations.
          </p>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Loading your saved designs...
            </p>
          </div>
        ) : designs.length === 0 ? (
          <div className="py-20 px-4 text-center max-w-md mx-auto space-y-5 bg-white dark:bg-[#0B1D3A]/40 border border-slate-200 dark:border-[#12345C]/60 rounded-3xl p-8 shadow-sm dark:shadow-none backdrop-blur-sm">
            <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-500/40 text-purple-700 dark:text-purple-300 mx-auto flex items-center justify-center">
              <BookmarkIcon size={28} />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                No saved designs yet.
              </h3>

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {designs.map((design) => (
              <div
                key={design.id}
                className="bg-white dark:bg-[#0B1D3A] border border-slate-200 dark:border-[#12345C] hover:border-purple-400 dark:hover:border-purple-500/50 rounded-2xl p-5 shadow-sm dark:shadow-xl flex flex-col justify-between transition-all hover:-translate-y-1 group"
              >
                <div className="space-y-4">
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

                  {/* Actual component preview */}
                  <div className="h-40 w-full rounded-xl bg-slate-100 dark:bg-[#020817] border border-slate-200 dark:border-[#12345C]/60 flex items-center justify-center p-4 relative overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-purple-500/5 to-cyan-500/5" />

                    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                      <div className="max-w-full max-h-full flex items-center justify-center">
                        <ComponentRenderer
                          type={design.componentType}
                          settings={design.settings}
                          device="desktop"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-200 dark:border-[#12345C]/60">
                  <button
                    type="button"
                    onClick={() => void handleDelete(design.id, design.name)}
                    disabled={deletingId === design.id}
                    className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors disabled:opacity-50"
                    title="Delete design"
                  >
                    {deletingId === design.id ? (
                      <span className="text-xs">...</span>
                    ) : (
                      <TrashIcon size={16} />
                    )}
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
