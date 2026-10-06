import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Palette, Check, X, Sun, Moon, Eye, Contrast, Waves, Sparkles, Crown } from 'lucide-react';
import { ThemeId } from '../types/theme';

export const ThemeSelectorModal: React.FC = () => {
  const { currentTheme, setTheme, themeOptions, isThemeModalOpen, setIsThemeModalOpen } = useTheme();

  if (!isThemeModalOpen) return null;

  const getThemeIcon = (id: ThemeId) => {
    switch (id) {
      case 'daylight-clean':
        return Sun;
      case 'botanical-dark':
        return Moon;
      case 'sunlight-contrast':
        return Contrast;
      case 'muted-sage':
        return Eye;
      case 'hydro-biolab':
        return Waves;
      case 'harvest-amber':
        return Sparkles;
      case 'opulent-glass':
        return Crown;
      default:
        return Palette;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-theme)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[var(--border-theme)]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[var(--accent-bg)] text-[var(--accent-color)] flex items-center justify-center border border-[var(--accent-color)]/30">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold tracking-tight">
                Console Theme & Visual Profile
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Select an environmental display mode optimized for your operating conditions
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsThemeModalOpen(false)}
            className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-subtle)] transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Themes Grid */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {themeOptions.map((opt) => {
              const isSelected = currentTheme === opt.id;
              const Icon = getThemeIcon(opt.id);

              return (
                <div
                  key={opt.id}
                  onClick={() => setTheme(opt.id)}
                  className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-[var(--accent-color)] bg-[var(--accent-bg)] shadow-md ring-1 ring-[var(--accent-color)]'
                      : 'border-[var(--border-theme)] bg-[var(--bg-surface-subtle)] hover:border-[var(--border-theme-strong)]'
                  }`}
                >
                  <div>
                    {/* Top row: Icon + Name + Category badge */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                          style={{
                            backgroundColor: opt.swatches.bg,
                            border: `1px solid ${opt.swatches.accent}`,
                            color: opt.swatches.accent,
                          }}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                          {opt.name}
                        </h4>
                      </div>

                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-[var(--accent-color)] text-black flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[var(--text-secondary)] mb-2 line-clamp-2">
                      {opt.description}
                    </p>
                  </div>

                  <div>
                    {/* Swatch Pill Bar */}
                    <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-theme)] mb-2">
                      <span className="text-[10px] font-mono text-[var(--text-muted)] mr-1">Palette:</span>
                      <div className="flex items-center gap-1">
                        <span
                          className="w-4 h-4 rounded-full border border-black/20"
                          style={{ backgroundColor: opt.swatches.bg }}
                          title="Background"
                        />
                        <span
                          className="w-4 h-4 rounded-full border border-black/20"
                          style={{ backgroundColor: opt.swatches.card }}
                          title="Surface"
                        />
                        <span
                          className="w-4 h-4 rounded-full border border-black/20"
                          style={{ backgroundColor: opt.swatches.accent }}
                          title="Accent"
                        />
                        <span
                          className="w-4 h-4 rounded-full border border-black/20"
                          style={{ backgroundColor: opt.swatches.text }}
                          title="Text"
                        />
                      </div>
                    </div>

                    {/* Operational Purpose Tag */}
                    <div className="text-[11px] font-mono text-[var(--accent-color)] leading-tight">
                      ✦ {opt.utility}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--border-theme)] flex items-center justify-between text-xs text-[var(--text-secondary)] bg-[var(--bg-surface)]">
          <span>Preferences are automatically saved to your device.</span>
          <button
            onClick={() => setIsThemeModalOpen(false)}
            className="px-4 py-2 rounded-lg bg-[var(--accent-color)] text-black font-semibold hover:opacity-90 transition-opacity min-h-[38px]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
