'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DailyVerse, Translation } from '@/lib/types';
import { Sparkles, X, Globe, ArrowRight } from 'lucide-react';

interface DailyVerseModalProps {
  isOpen: boolean;
  onClose: () => void;
  translations: Translation[];
}

export function DailyVerseModal({ isOpen, onClose, translations }: DailyVerseModalProps) {
  const router = useRouter();
  const [dailyData, setDailyData] = useState<DailyVerse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch('/api/daily-verse')
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setDailyData(data.data);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[88vh] sm:max-h-[85vh] flex flex-col rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
          <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
            <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
            <div className="min-w-0">
              <h2 className="text-base sm:text-xl font-bold tracking-tight truncate">Verse of the Day</h2>
              <p className="text-xs text-[var(--text-muted)] truncate">
                {dailyData ? `${dailyData.book?.name_en} ${dailyData.chapter}:${dailyData.verse_num}` : 'Today\'s Scripture'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-full hover:bg-[var(--border-color)] transition-colors text-[var(--text-secondary)]"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3 sm:space-y-4">
          {loading ? (
            <div className="py-12 text-center text-xs text-[var(--text-muted)]">
              Loading scripture across languages...
            </div>
          ) : dailyData ? (
            <>
              {/* Reference Banner */}
              <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[var(--accent-light)] border border-[var(--accent-color)]/20 text-center space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[var(--accent-color)]">
                  Scripture Reference
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] font-serif">
                  {dailyData.book?.name_en} {dailyData.chapter}:{dailyData.verse_num}
                </h3>
                {dailyData.book?.name_am && (
                  <p className="font-eth text-sm sm:text-base text-[var(--accent-color)]">
                    {dailyData.book.name_am} {dailyData.chapter}፥{dailyData.verse_num}
                  </p>
                )}
              </div>

              {/* Verses across translations */}
              <div className="space-y-3">
                {Object.entries(dailyData.verses || {}).map(([code, text]) => {
                  const tr = translations.find((t) => t.code === code);
                  if (!tr) return null;
                  const isRtl = tr.script_direction === 'rtl';

                  return (
                    <div
                      key={code}
                      dir={tr.script_direction}
                      className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)] space-y-1 ${
                        isRtl ? 'text-right' : 'text-left'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs pb-1 border-b border-[var(--border-color)]/60">
                        <div className="flex items-center space-x-1.5 font-bold text-[var(--accent-color)]">
                          <Globe className="w-3.5 h-3.5" />
                          <span>{tr.language}</span>
                        </div>
                        <span className="font-mono text-[10px] text-[var(--text-muted)]">
                          {tr.short_code || tr.code}
                        </span>
                      </div>
                      <p
                        className={`text-sm sm:text-base leading-relaxed text-[var(--text-primary)] pt-1 ${
                          code.startsWith('am-') ? 'font-eth' : code.startsWith('heb') ? 'font-serif' : ''
                        }`}
                      >
                        {text}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Read chapter action */}
              <div className="pt-3">
                <button
                  onClick={() => {
                    onClose();
                    router.push(`/read/${dailyData.book?.slug || 'genesis'}/${dailyData.chapter}?v=${dailyData.verse_num}`);
                  }}
                  className="w-full inline-flex items-center justify-center space-x-2 py-3 px-4 rounded-xl sm:rounded-2xl bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white text-xs font-bold transition-transform active:scale-95 shadow-md"
                >
                  <span>Read Full Chapter</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-xs text-[var(--text-muted)]">
              No daily verse available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
