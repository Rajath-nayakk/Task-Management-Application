import React from 'react';
import { use3DStore, ACCENT_PRESETS } from '../../store/use3DStore';
import { useTheme } from '../../context/ThemeContext';
import { Palette, Sun, Moon, Sparkles, X } from 'lucide-react';

export const CustomizerPanel: React.FC = () => {
  const { accent, setAccent, customizerOpen, setCustomizerOpen } = use3DStore();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Trigger Button */}
      {!customizerOpen ? (
        <button
          onClick={() => setCustomizerOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-900 text-white border border-slate-700/80 backdrop-blur-xl shadow-2xl hover:scale-105 active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-indigo-500"
          aria-label="Open 3D Real-time Customizer"
        >
          <div
            className="w-3.5 h-3.5 rounded-full animate-pulse"
            style={{ backgroundColor: accent.hex, boxShadow: `0 0 10px ${accent.hex}` }}
          />
          <Palette className="w-4 h-4 text-slate-300" />
          <span className="text-xs font-bold tracking-wide">3D Studio</span>
        </button>
      ) : (
        /* Floating Studio Panel */
        <div className="w-80 bg-slate-950/90 border border-slate-800/90 rounded-3xl p-5 shadow-2xl backdrop-blur-2xl text-slate-100 animate-slide-up">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" style={{ color: accent.hex }} />
              <h3 className="font-display font-bold text-sm tracking-tight text-white">
                Task Core Customizer
              </h3>
            </div>
            <button
              onClick={() => setCustomizerOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60 transition-colors"
              aria-label="Close customizer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-4 space-y-4">
            {/* Color Swatches */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400">
                  Core Emissive Color
                </span>
                <span
                  className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: `${accent.hex}25`, color: accent.hex }}
                >
                  {accent.name}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                {ACCENT_PRESETS.map((preset) => {
                  const isSelected = accent.id === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => setAccent(preset)}
                      className={`relative w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                        isSelected
                          ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-slate-950'
                          : 'opacity-70 hover:opacity-100 hover:scale-105'
                      }`}
                      style={{
                        backgroundColor: preset.hex,
                        boxShadow: isSelected ? `0 0 16px ${preset.hex}` : 'none',
                      }}
                      title={preset.name}
                      aria-label={`Select ${preset.name} theme`}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-white shadow-sm" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mode & Theme Selector */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="block text-xs font-semibold text-slate-300">
                  Environment Tone
                </span>
                <span className="text-[11px] text-slate-500">
                  Current: {theme === 'dark' ? 'Deep Space Dark' : 'Clean Studio Light'}
                </span>
              </div>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-xs font-medium text-slate-200 transition-colors"
                aria-label="Toggle dark/light theme"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Dark</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 text-center pt-2 border-t border-slate-800/60">
            Real-time WebGL shader updates at 60fps
          </div>
        </div>
      )}
    </div>
  );
};
