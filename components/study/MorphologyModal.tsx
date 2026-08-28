'use client';

import React, { useState } from 'react';
import { getVerseMorphology } from '@/lib/lexicon';
import { MorphologyWord } from '@/lib/types';
import { X, BookMarked, Copy, Check, Sparkles, Languages } from 'lucide-react';

interface MorphologyModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookSlug: string;
  bookName: string;
  chapter: number;
  verseNum: number;
  testament: 'old' | 'new';
  originalText?: string;
}

export function MorphologyModal({
  isOpen,
  onClose,
  bookSlug,
  bookName,
  chapter,
  verseNum,
  testament,
  originalText,
}: MorphologyModalProps) {
  const [selectedWord, setSelectedWord] = useState<MorphologyWord | null>(null);
  const [copiedStrongs, setCopiedStrongs] = useState<string | null>(null);

  if (!isOpen) return null;

  const morphology = getVerseMorphology(bookSlug, testament, chapter, verseNum, originalText);
  const isHebrew = morphology.language === 'Hebrew';

  const handleCopy = (word: MorphologyWord) => {
    const text = `[${word.strongs_id}] ${word.surface_form} (${word.transliteration}) - Lemma: ${word.lemma}\nPart of Speech: ${word.part_of_speech}\nDefinition: ${word.definition_en} / ${word.definition_am || ''}`;
    navigator.clipboard.writeText(text);
    setCopiedStrongs(word.strongs_id);
    setTimeout(() => setCopiedStrongs(null), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-secondary)]/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-[var(--accent-color)] text-white flex items-center justify-center shadow-sm">
              <Languages className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
                {isHebrew ? 'ዕብራይስጥ • Hebrew Morphology' : 'ግሪክ • Greek Morphology'}
              </h2>
              <p className="text-[11px] text-[var(--accent-color)] font-semibold">
                {bookName} {chapter}:{verseNum} • Strong’s Concordance
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Word Grid & Lexicon List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Top Info Banner */}
          <div className="p-3 rounded-2xl bg-[var(--accent-light)] border border-[var(--accent-color)]/20 text-xs text-[var(--text-primary)] flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[var(--accent-color)] shrink-0" />
            <span>
              Click on any word below to inspect its Strong’s Root ID, linguistic morphology, and theological gloss.
            </span>
          </div>

          {/* Interactive Word Chips Flow */}
          <div
            className={`flex flex-wrap gap-2 p-3.5 rounded-2xl bg-[var(--bg-secondary)]/60 border border-[var(--border-color)] ${
              isHebrew ? 'flex-row-reverse text-right' : 'flex-row text-left'
            }`}
            dir={isHebrew ? 'rtl' : 'ltr'}
          >
            {morphology.words.map((word, index) => {
              const isSelected = selectedWord?.strongs_id === word.strongs_id;
              return (
                <button
                  key={`${word.strongs_id}-${index}`}
                  onClick={() => setSelectedWord(word)}
                  className={`px-3 py-2 rounded-xl transition-all border text-sm font-semibold flex flex-col items-center gap-0.5 ${
                    isSelected
                      ? 'bg-[var(--accent-color)] text-white border-transparent shadow-md scale-105'
                      : 'bg-[var(--bg-surface)] text-[var(--text-primary)] border-[var(--border-color)] hover:border-[var(--accent-color)] shadow-sm'
                  }`}
                >
                  <span className={isHebrew ? 'font-hebrew text-base' : 'font-greek text-base'}>
                    {word.surface_form}
                  </span>
                  <span className={`text-[10px] font-mono ${isSelected ? 'text-white/90' : 'text-[var(--accent-color)]'}`}>
                    {word.strongs_id}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Word Deep Lexicon Detail Card */}
          {selectedWord ? (
            <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-surface)] border-2 border-[var(--accent-color)] shadow-lg space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--border-color)]">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[var(--accent-color)] text-white">
                    {selectedWord.strongs_id}
                  </span>
                  <span className="text-xs font-semibold text-[var(--text-muted)]">
                    {selectedWord.part_of_speech}
                  </span>
                </div>

                <button
                  onClick={() => handleCopy(selectedWord)}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] text-xs text-[var(--text-secondary)] font-medium transition-colors"
                >
                  {copiedStrongs === selectedWord.strongs_id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Lexicon</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-bold block">
                    Surface Form & Transliteration
                  </span>
                  <p className="text-lg font-bold text-[var(--text-primary)]">
                    <span className={isHebrew ? 'font-hebrew mr-2' : 'font-greek mr-2'}>
                      {selectedWord.surface_form}
                    </span>
                    <span className="text-sm font-normal text-[var(--text-secondary)] italic">
                      ({selectedWord.transliteration})
                    </span>
                  </p>
                </div>

                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-bold block">
                    Root Lemma
                  </span>
                  <p className="text-base font-bold text-[var(--accent-color)]">
                    <span className={isHebrew ? 'font-hebrew' : 'font-greek'}>{selectedWord.lemma}</span>
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--border-color)] space-y-1.5">
                <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-bold block">
                  Definitions & Concordance Meaning
                </span>
                <p className="text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed font-medium">
                  {selectedWord.definition_en}
                </p>
                {selectedWord.definition_am && (
                  <p className="text-xs sm:text-sm text-[var(--accent-color)] font-eth leading-relaxed pt-0.5">
                    ትርጉም (Amharic): {selectedWord.definition_am}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-[var(--text-muted)] bg-[var(--bg-secondary)]/30 rounded-2xl border border-dashed border-[var(--border-color)]">
              Select any Hebrew or Greek word chip above to view its detailed lexical breakdown.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
