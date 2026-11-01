
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../common/Modal';
import { usePlayground } from '../../context/PlaygroundContext';
import { saveDesign } from '../../utils/storage';
import { BookmarkIcon } from '../icons';

interface SaveDesignModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SaveDesignModal: React.FC<SaveDesignModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    selectedComponent,
    settings,
    tabletSettings,
    mobileSettings,
    showToast,
  } = usePlayground();

  const [designName, setDesignName] = useState('');
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleSave = async (openSavedPage = false) => {
    const name =
      designName.trim() ||
      `${selectedComponent.charAt(0).toUpperCase()}${selectedComponent.slice(1)} Design`;

    try {
      setSaving(true);

      await saveDesign({
        name,
        componentType: selectedComponent,
        settings,
        responsive: {
          tablet: tabletSettings,
          mobile: mobileSettings,
        },
      });

      showToast(`Saved "${name}" successfully!`, 'success');
      setDesignName('');
      onClose();

      if (openSavedPage) {
        navigate('/saved');
      }
    } catch (error) {
      console.error('Save design error:', error);
      showToast(
        error instanceof Error ? error.message : 'Unable to save design.',
        'info'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void handleSave(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={saving ? () => {} : onClose} title="Save Design">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Design Name
          </label>

          <input
            type="text"
            required
            autoFocus
            value={designName}
            onChange={(e) => setDesignName(e.target.value)}
            placeholder={`e.g. Modern Glow ${selectedComponent}`}
            disabled={saving}
            className="w-full px-4 py-3 rounded-xl bg-[#07152B] border border-[#12345C] text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm transition-all"
          />
        </div>

        <div className="p-3.5 rounded-xl bg-[#07152B]/70 border border-[#12345C]/50 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
            <span>Target Component:</span>
          </div>

          <span className="font-semibold text-purple-300 uppercase tracking-wider bg-purple-950/60 px-2.5 py-0.5 rounded-md border border-purple-800/40">
            {selectedComponent}
          </span>
        </div>

        <div className="text-xs text-slate-400 leading-relaxed">
          Saves your component settings and responsive overrides securely to your account.
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#12345C]/60">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 text-sm font-medium transition-colors disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white text-sm font-medium transition-all shadow-sm disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() => void handleSave(true)}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-sm font-semibold shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <BookmarkIcon size={15} />
            <span>{saving ? 'Saving...' : 'Save & View Saved'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
