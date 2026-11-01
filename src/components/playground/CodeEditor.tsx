import React, { useState, useMemo, useEffect } from 'react';
import { usePlayground } from '../../context/PlaygroundContext';
import { generateCss } from '../../utils/cssGenerator';
import { generateScss } from '../../utils/scssGenerator';
import { generateTailwind } from '../../utils/tailwindGenerator';
import { CodeIcon, CopyIcon, CheckIcon, SparklesIcon } from '../icons';
import { CodeTab } from '../../types/playground';

export const CodeEditor: React.FC = () => {
  const {
    selectedComponent,
    settings,
    tabletSettings,
    mobileSettings,
    codeTab,
    setCodeTab,
    isHeld,
    isLocked,
    manualCss,
    applyManualCss,
    showToast,
  } = usePlayground();

  const [copied, setCopied] = useState(false);
  const [editableCode, setEditableCode] = useState('');

  // Generate code based on active tab
  const generatedCode = useMemo(() => {
    switch (codeTab) {
      case 'scss':
        return generateScss(selectedComponent, settings, tabletSettings, mobileSettings);
      case 'tailwind':
        return generateTailwind(selectedComponent, settings);
      case 'css':
      default:
        return manualCss || generateCss(selectedComponent, settings, tabletSettings, mobileSettings);
    }
  }, [selectedComponent, settings, tabletSettings, mobileSettings, codeTab, manualCss]);

  // Keep editable code synced when generated code updates
  useEffect(() => {
    setEditableCode(generatedCode);
  }, [generatedCode]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(isHeld && codeTab === 'css' ? editableCode : generatedCode);
      setCopied(true);
      showToast(`${codeTab.toUpperCase()} copied to clipboard!`, 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      showToast('Failed to copy to clipboard', 'info');
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isLocked) return;
    const val = e.target.value;
    setEditableCode(val);
    if (codeTab === 'css') {
      applyManualCss(val);
    }
  };

  const lines = (isHeld && codeTab === 'css' ? editableCode : generatedCode).split('\n');

  return (
    <div className="bg-[#0B1D3A] border border-[#12345C] rounded-2xl shadow-xl flex flex-col h-full overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#12345C]/70 bg-[#07152B]/80">
        <div className="flex items-center gap-2 text-slate-200 font-semibold text-xs tracking-wide">
          <CodeIcon size={16} className="text-purple-400" />
          <span>Generated {codeTab.toUpperCase()}</span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-semibold shadow-[0_0_12px_rgba(124,58,237,0.4)] transition-all active:scale-95"
        >
          {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* Language Switcher Tabs */}
      <div className="px-4 py-2.5 border-b border-[#12345C]/50 bg-[#07152B]/40 flex items-center gap-2">
        {(['css', 'scss', 'tailwind'] as CodeTab[]).map((tab) => {
          const isActive = codeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setCodeTab(tab)}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                isActive
                  ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(124,58,237,0.5)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#12345C]/40'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Code Editor Window: HOLD = Editable Textarea, RELEASE = Read-Only Syntax Viewer */}
      {isHeld && codeTab === 'css' ? (
        <div className="flex-1 p-3 flex flex-col bg-[#040C1A] font-mono text-xs overflow-hidden">
          <textarea
            value={editableCode}
            onChange={handleCodeChange}
            disabled={isLocked}
            spellCheck={false}
            className="w-full flex-1 p-3 bg-[#020817] text-slate-100 rounded-lg border border-[#12345C] focus:border-purple-500 focus:outline-none resize-none font-mono text-xs leading-relaxed scrollbar-thin"
            placeholder="Type custom CSS rules here..."
          />
        </div>
      ) : (
        <div className="flex-1 p-3 overflow-auto bg-[#040C1A] text-xs font-mono select-text max-h-[calc(100vh-320px)] scrollbar-thin">
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((line, idx) => {
                const isComment = line.trim().startsWith('/*') || line.trim().startsWith('<!--') || line.trim().startsWith('//');
                const isSelector = line.includes('{') || line.includes('@media') || line.includes('@keyframes');
                const isProperty = line.includes(':') && !isSelector;

                return (
                  <tr key={idx} className="hover:bg-slate-800/30">
                    <td className="w-8 pr-4 text-right text-slate-600 select-none text-[11px] align-top">
                      {idx + 1}
                    </td>
                    <td className="text-slate-200 whitespace-pre font-mono leading-relaxed">
                      {isComment ? (
                        <span className="text-slate-500 italic">{line}</span>
                      ) : isSelector ? (
                        <span className="text-amber-400 font-semibold">{line}</span>
                      ) : isProperty ? (
                        (() => {
                          const parts = line.split(':');
                          const prop = parts[0];
                          const val = parts.slice(1).join(':');
                          return (
                            <>
                              <span className="text-cyan-300">{prop}:</span>
                              <span className="text-purple-300">{val}</span>
                            </>
                          );
                        })()
                      ) : (
                        line
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Bottom Info Alert Box */}
      <div className="p-3.5 m-3 rounded-xl bg-gradient-to-r from-purple-950/40 to-blue-950/40 border border-purple-500/30 flex items-start gap-3 shadow-inner">
        <div className="p-1.5 rounded-lg bg-purple-600/30 text-purple-300 flex-shrink-0 mt-0.5">
          <SparklesIcon size={16} />
        </div>
        <div>
          <h4 className="text-xs font-semibold text-slate-100">
            Your {codeTab.toUpperCase()} is ready!
          </h4>
          <p className="text-[11px] text-slate-400">
            Copy the clean code and use it directly in your project.
          </p>
        </div>
      </div>
    </div>
  );
};
