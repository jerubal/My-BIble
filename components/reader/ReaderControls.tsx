'use client';

import React from 'react';
import { Translation } from '@/lib/types';
import { Columns, AlignJustify, Sun, Moon, Sparkles, Info, Type, Globe, Check, Star } from 'lucide-react';

interface ReaderControlsProps {
  fontSize: number;
  setFontSize: (size: number) => void;
  isParallelMode: boolean;
  setIsParallelMode: (parallel: boolean) => void;
  parallelLayout: 'columns' | 'stacked';
  setParallelLayout: (layout: 'columns' | 'stacked') => void;
  availableTranslations: Translation[];
  primaryTranslationCode: string;
  setPrimaryTranslationCode: (code: string) => void;
  parallelTranslationCodes: string[];
  onToggleParallelTranslation: (code: string) => void;
  theme: string;
  setTheme: (theme: string) => void;
  onOpenAttribution: () => void;
  onOpenSavedVerses?: () => void;
}

export function ReaderControls({
  fontSize,
  setFontSize,
  isParallelMode,
  setIsParallelMode,
  parallelLayout,
  setParallelLayout,
  availableTranslations,
  primaryTranslationCode,
  setPrimaryTranslationCode,
  parallelTranslationCodes,
  onToggleParallelTranslation,
  theme,
  setTheme,
  onOpenAttribution,
  onOpenSavedVerses,
}: ReaderControlsProps) {
  const activeTranslations = availableTranslations.filter((t) => t.is_active);

  return (
    <aside aria-label="Reader settings" className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-3 sm:space-y-4 w-full overflow-hidden">
      {/* Top row: Translation Switching & Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
        {/* Primary Translation Switcher or Mode indicator */}
        <div className="flex items-center space-x-2 min-w-0">
          <Globe className="w-4 h-4 text-[var(--accent-color)] shrink-0" />
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] shrink-0">
            {isParallelMode ? 'Parallel Mode:' : 'Translation:'}
          </span>

          {!isParallelMode ? (
            <select
              value={primaryTranslationCode}
              onChange={(e) => setPrimaryTranslationCode(e.target.value)}
              className="text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] cursor-pointer truncate max-w-[200px] sm:max-w-xs"
            >
              {activeTranslations.map((tr) => (
                <option key={tr.code} value={tr.code}>
                  {tr.language} — {tr.name} ({tr.short_code || tr.code})
                </option>
              ))}
            </select>
          ) : (
            <span className="text-xs font-semibold text-[var(--accent-color)]">
              {parallelTranslationCodes.length} Compared
            </span>
          )}
        </div>

        {/* Parallel View Mode Toggle Button */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsParallelMode(!isParallelMode)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              isParallelMode
                ? 'bg-[var(--accent-color)] text-white border-transparent shadow-sm'
                : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--accent-color)]'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>{isParallelMode ? '✓ Parallel Mode' : '+ Compare Parallel'}</span>
          </button>

          {isParallelMode && (
            <div className="inline-flex rounded-lg p-0.5 bg-[var(--bg-secondary)] border border-[var(--border-color)]">
              <button
                onClick={() => setParallelLayout('columns')}
                className={`p-1.5 rounded-md text-xs font-medium ${
                  parallelLayout === 'columns' ? 'bg-[var(--bg-surface)] text-[var(--accent-color)] shadow-sm' : 'text-[var(--text-muted)]'
                }`}
                title="Side-by-side Columns"
              >
                <Columns className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setParallelLayout('stacked')}
                className={`p-1.5 rounded-md text-xs font-medium ${
                  parallelLayout === 'stacked' ? 'bg-[var(--bg-surface)] text-[var(--accent-color)] shadow-sm' : 'text-[var(--text-muted)]'
                }`}
                title="Stacked Verses"
              >
                <AlignJustify className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Middle row: Text Size, Themes, Saved Verses, Attribution */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--border-color)]">
        {/* Text Size Controls */}
        <div className="flex items-center space-x-2">
          <Type className="w-4 h-4 text-[var(--text-muted)]" />
          <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase">Size:</span>
          <div className="inline-flex items-center rounded-lg p-0.5 bg-[var(--bg-secondary)] border border-[var(--border-color)]">
            <button
              onClick={() => setFontSize(Math.max(14, fontSize - 2))}
              disabled={fontSize <= 14}
              className="px-2.5 py-1 text-xs font-bold rounded hover:bg-[var(--bg-surface)] disabled:opacity-30 text-[var(--text-primary)]"
              aria-label="Decrease text size"
            >
              A-
            </button>
            <span className="px-2 text-xs font-semibold text-[var(--text-secondary)] font-mono">
              {fontSize}px
            </span>
            <button
              onClick={() => setFontSize(Math.min(32, fontSize + 2))}
              disabled={fontSize >= 32}
              className="px-2.5 py-1 text-xs font-bold rounded hover:bg-[var(--bg-surface)] disabled:opacity-30 text-[var(--text-primary)]"
              aria-label="Increase text size"
            >
              A+
            </button>
          </div>
        </div>

        {/* Theme Selectors */}
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase">Theme:</span>
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setTheme('sepia')}
              className={`w-7 h-7 rounded-full border-2 bg-[#f7f1e5] flex items-center justify-center transition-all ${
                theme === 'sepia' ? 'border-[var(--accent-color)] scale-110 shadow-sm' : 'border-neutral-300'
              }`}
              title="Sepia"
              aria-label="Sepia Theme"
            >
              <span className="w-2 h-2 rounded-full bg-[#8a3b14]" />
            </button>
            <button
              onClick={() => setTheme('light')}
              className={`w-7 h-7 rounded-full border-2 bg-[#ffffff] flex items-center justify-center transition-all ${
                theme === 'light' ? 'border-[var(--accent-color)] scale-110 shadow-sm' : 'border-neutral-300'
              }`}
              title="Light"
              aria-label="Light Theme"
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`w-7 h-7 rounded-full border-2 bg-[#121824] flex items-center justify-center transition-all ${
                theme === 'dark' ? 'border-[var(--accent-color)] scale-110 shadow-sm' : 'border-neutral-700'
              }`}
              title="Dark"
              aria-label="Dark Theme"
            >
              <Moon className="w-3.5 h-3.5 text-sky-400" />
            </button>
            <button
              onClick={() => setTheme('black')}
              className={`w-7 h-7 rounded-full border-2 bg-[#000000] flex items-center justify-center transition-all ${
                theme === 'black' ? 'border-[var(--accent-color)] scale-110 shadow-sm' : 'border-neutral-700'
              }`}
              title="Black"
              aria-label="Black Theme"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            </button>
          </div>
        </div>

        {/* Action Links: Saved Favorites and Attribution */}
        <div className="flex items-center space-x-2">
          {onOpenSavedVerses && (
            <button
              onClick={onOpenSavedVerses}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] text-amber-600 dark:text-amber-400 transition-colors border border-[var(--border-color)]"
            >
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>Saved Verses</span>
            </button>
          )}

          <button
            onClick={onOpenAttribution}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] text-[var(--text-secondary)] transition-colors border border-[var(--border-color)]"
          >
            <Info className="w-3.5 h-3.5 text-[var(--accent-color)]" />
            <span className="hidden sm:inline">Attribution</span>
          </button>
        </div>
      </div>

      {/* Bottom row: Parallel Translation Selection (Shown when Parallel Mode is ON) */}
      {isParallelMode && (
        <div className="pt-3 border-t border-[var(--border-color)] animate-fadeIn">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mr-1">
              Compare:
            </span>
            {activeTranslations.map((tr) => {
              const isSelected = parallelTranslationCodes.includes(tr.code);
              return (
                <button
                  key={tr.code}
                  onClick={() => onToggleParallelTranslation(tr.code)}
                  className={`px-2.5 py-1 text-xs rounded-xl font-medium transition-all flex items-center space-x-1.5 border ${
                    isSelected
                      ? 'bg-[var(--accent-light)] border-[var(--accent-color)] text-[var(--accent-color)] font-semibold shadow-sm'
                      : 'bg-[var(--bg-secondary)] border-transparent text-[var(--text-secondary)] hover:border-[var(--border-color)] opacity-60'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-[var(--accent-color)]" />}
                  <span>{tr.language}</span>
                  <span className="text-[10px] font-mono px-1 rounded bg-[var(--bg-surface)] text-[var(--text-muted)]">
                    {tr.short_code || tr.code}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
}
