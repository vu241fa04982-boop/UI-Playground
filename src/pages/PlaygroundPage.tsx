import React, { useState } from 'react';
import { StyleControls } from '../components/playground/StyleControls';
import { LivePreview } from '../components/playground/LivePreview';
import { CodeEditor } from '../components/playground/CodeEditor';
import { ExploreComponentsBar } from '../components/playground/ExploreComponentsBar';
import { SaveDesignModal } from '../components/playground/SaveDesignModal';

export const PlaygroundPage: React.FC = () => {
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020817] text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-[1440px] mx-auto space-y-6">
        {/* Header Section matching reference image */}
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            UI <span className="hero-gradient-text bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 dark:from-purple-400 dark:via-fuchsia-400 dark:to-pink-500 bg-clip-text text-transparent">Playground</span>
          </h1>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Design, customize and generate CSS in real time.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Adjust the properties, see the changes instantly and copy your CSS code.
          </p>
        </div>

        {/* Three-Column Workspace Layout matching reference image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* LEFT: Style Controls (approx 3.2 cols) */}
          <div className="lg:col-span-3 flex flex-col">
            <StyleControls onOpenSaveModal={() => setIsSaveModalOpen(true)} />
          </div>

          {/* CENTER: Live Preview (approx 5.6 cols) */}
          <div className="lg:col-span-6 flex flex-col min-h-[540px]">
            <LivePreview />
          </div>

          {/* RIGHT: Generated CSS (approx 3.2 cols) */}
          <div className="lg:col-span-3 flex flex-col">
            <CodeEditor />
          </div>
        </div>

        {/* Bottom Bar: Explore Components shelf matching reference image */}
        <ExploreComponentsBar />
      </div>

      {/* Save Modal */}
      <SaveDesignModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
      />
    </div>
  );
};
