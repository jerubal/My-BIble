'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getVerseMorphology } from '@/lib/lexicon';
import { getCrossReferences } from '@/lib/cross-references';
import { MorphologyWord, CrossReference } from '@/lib/types';
import { Sparkles, Link2, ExternalLink, ChevronDown, ChevronUp, Copy, Check, BookOpen } from 'lucide-react';

import { recordWordLookup } from '@/lib/reading-tracker';

interface InlineVerseStudyStripProps {
  bookSlug: string;
  bookName: string;
  testament: 'old' | 'new';
  chapter: number;
  verseNum: number;
  originalText?: string;
}

export function InlineVerseStudyStrip({
  bookSlug,
  bookName,
  testament,
  chapter,
  verseNum,
  originalText,
}: InlineVerseStudyStripProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'none' | 'strongs' | 'crossref'>('none');
  const [selectedWord, setSelectedWord] = useState<MorphologyWord | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const isHebrew = testament === 'old';
  const languageName = isHebrew ? 'ዕብራይስጥ • Hebrew' : 'ግሪክ • Greek';

  const morphology = getVerseMorphology(bookSlug, testament, chapter, verseNum, originalText);
  const crossRefs = getCrossReferences(bookSlug, chapter, verseNum);

  const handleSelectWord = (word: MorphologyWord) => {
    if (selectedWord?.strongs_id === word.strongs_id) {
      setSelectedWord(null);
    } else {
      setSelectedWord(word);
      recordWordLookup({
        surface_form: word.surface_form,
        strongs_id: word.strongs_id,
        transliteration: word.transliteration,
        definition_en: word.definition_en,
        definition_am: word.definition_am,
        bookSlug,
        bookName,
        chapter,
        verseNum,
      });
    }
  };

  const handleToggleTab = (tab: 'strongs' | 'crossref', e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveTab(activeTab === tab ? 'none' : tab);
  };

  const handleCopyWord = (word: MorphologyWord, e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `[${word.strongs_id}] ${word.surface_form} (${word.transliteration}) - Lemma: ${word.lemma}\n${word.part_of_speech}\nDefinition: ${word.definition_en} / ${word.definition_am || ''}`;
    navigator.clipboard.writeText(text);
    setCopiedId(word.strongs_id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleJumpToRef = (ref: CrossReference, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/read/${ref.target_book_slug}/${ref.target_chapter}?v=${ref.target_verse_start}`);
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="mt-2 pt-2 border-t border-[var(--border-color)]/40 space-y-2 select-text"
    >
      {/* Touch Tabs Row (Only tabs visible by default) */}
      <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
        {/* Tab 1: Strong's Concordance & Original Text */}
        <button
          onClick={(e) => handleToggleTab('strongs', e)}
          className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold transition-all border ${
            activeTab === 'strongs'
              ? 'bg-[var(--accent-color)] text-white border-transparent shadow-sm'
              : 'bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] text-[var(--accent-color)] border-[var(--border-color)]'
          }`}
          title="Tap to reveal Strong's Concordance and original Hebrew/Greek text"
          aria-label="Toggle Strong's Concordance"
        >
          <Sparkles className="w-3 h-3" />
          <span>{isHebrew ? 'Strong’s • ዕብራይስጥ' : 'Strong’s • ግሪክ'}</span>
          {activeTab === 'strongs' ? <ChevronUp className="w-3 h-3 ml-0.5" /> : <ChevronDown className="w-3 h-3 ml-0.5" />}
        </button>

        {/* Tab 2: Cross-References (TSK) */}
        <button
          onClick={(e) => handleToggleTab('crossref', e)}
          className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold transition-all border ${
            activeTab === 'crossref'
              ? 'bg-[var(--accent-color)] text-white border-transparent shadow-sm'
              : 'bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] text-[var(--text-secondary)] border-[var(--border-color)]'
          }`}
          title="Tap to reveal Treasury of Scripture Knowledge cross-references"
          aria-label="Toggle Cross-References"
        >
          <Link2 className="w-3 h-3" />
          <span>Cross-Ref ({crossRefs.length})</span>
          {activeTab === 'crossref' ? <ChevronUp className="w-3 h-3 ml-0.5" /> : <ChevronDown className="w-3 h-3 ml-0.5" />}
        </button>
      </div>

      {/* ========================================================= */}
      {/* 1. REVEALED ON TOUCH: Strong's & Original Greek/Hebrew    */}
      {/* ========================================================= */}
      {activeTab === 'strongs' && (
        <div className="p-3 sm:p-4 rounded-2xl bg-[var(--bg-secondary)]/90 border-2 border-[var(--accent-color)]/40 shadow-md space-y-3 animate-fadeIn text-xs">
          {/* Header & Original Text Banner */}
          <div className="space-y-1.5 pb-2 border-b border-[var(--border-color)]">
            <div className="flex items-center justify-between text-[10px] uppercase font-bold text-[var(--accent-color)]">
              <span>{languageName} Original Text</span>
              <span className="font-mono text-[var(--text-muted)] font-normal">
                {bookName} {chapter}:{verseNum}
              </span>
            </div>

            {/* Original Scripture Script */}
            <p
              className={`p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] leading-relaxed text-[var(--text-primary)] ${
                isHebrew ? 'font-hebrew text-base sm:text-lg text-right' : 'font-greek text-sm sm:text-base text-left'
              }`}
              dir={isHebrew ? 'rtl' : 'ltr'}
            >
              {originalText || (isHebrew ? 'בְּרֵאשִׁית בָּרָא אֱלֹהִים...' : 'Ἐν ἀρχῇ ἦν ὁ Λόγος...')}
            </p>
          </div>

          {/* Word-by-word Strong's Breakdown chips */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider block">
              Tap a word to inspect Strong’s Root & Meaning:
            </span>
            <div
              className={`flex flex-wrap gap-1.5 pt-1 ${isHebrew ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}
              dir={isHebrew ? 'rtl' : 'ltr'}
            >
              {morphology.words.map((word, wIdx) => {
                const isSelected = selectedWord?.strongs_id === word.strongs_id;
                return (
                  <button
                    key={`${word.strongs_id}-${wIdx}`}
                    onClick={() => handleSelectWord(word)}
                    className={`px-2.5 py-1.5 rounded-xl border transition-all text-left flex flex-col items-center gap-0.5 ${
                      isSelected
                        ? 'bg-[var(--accent-color)] text-white border-transparent shadow-sm scale-105'
                        : 'bg-[var(--bg-surface)] text-[var(--text-primary)] border-[var(--border-color)] hover:border-[var(--accent-color)]'
                    }`}
                  >
                    <span className={isHebrew ? 'font-hebrew text-sm' : 'font-greek text-sm'}>
                      {word.surface_form}
                    </span>
                    <span
                      className={`text-[9px] font-mono font-bold ${
                        isSelected ? 'text-white' : 'text-[var(--accent-color)]'
                      }`}
                    >
                      {word.strongs_id}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Word Meaning Card */}
          {selectedWord && (
            <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[var(--accent-color)] text-white">
                    {selectedWord.strongs_id}
                  </span>
                  <span className="text-[11px] font-semibold text-[var(--text-muted)]">
                    {selectedWord.part_of_speech}
                  </span>
                </div>

                <button
                  onClick={(e) => handleCopyWord(selectedWord, e)}
                  className="flex items-center space-x-1 px-2 py-0.5 rounded-md bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] text-[10px] font-medium text-[var(--text-secondary)]"
                >
                  {copiedId === selectedWord.strongs_id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] uppercase text-[var(--text-muted)] font-bold">Word / Phonetics:</span>
                  <p className="font-bold text-[var(--text-primary)]">
                    <span className={isHebrew ? 'font-hebrew mr-1.5' : 'font-greek mr-1.5'}>
                      {selectedWord.surface_form}
                    </span>
                    <span className="text-[11px] font-normal italic text-[var(--text-secondary)]">
                      ({selectedWord.transliteration})
                    </span>
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[var(--text-muted)] font-bold">Base Lemma:</span>
                  <p className="font-bold text-[var(--accent-color)]">
                    <span className={isHebrew ? 'font-hebrew' : 'font-greek'}>{selectedWord.lemma}</span>
                  </p>
                </div>
              </div>

              <div className="pt-1.5 border-t border-[var(--border-color)]/60 text-xs space-y-1">
                <p className="text-[var(--text-primary)] leading-relaxed">
                  <strong className="text-[var(--text-muted)] uppercase text-[10px]">Definition:</strong>{' '}
                  {selectedWord.definition_en}
                </p>
                {selectedWord.definition_am && (
                  <p className="text-[var(--accent-color)] font-eth leading-relaxed">
                    <strong className="text-[var(--text-muted)] uppercase text-[10px] font-sans">አማርኛ ትርጉም:</strong>{' '}
                    {selectedWord.definition_am}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. REVEALED ON TOUCH: TSK Cross-References                */}
      {/* ========================================================= */}
      {activeTab === 'crossref' && (
        <div className="p-3 sm:p-4 rounded-2xl bg-[var(--bg-secondary)]/90 border-2 border-[var(--accent-color)]/40 shadow-md space-y-2.5 animate-fadeIn text-xs">
          <div className="flex items-center justify-between pb-1.5 border-b border-[var(--border-color)]">
            <div className="flex items-center space-x-1.5 font-bold text-[var(--text-primary)]">
              <Link2 className="w-3.5 h-3.5 text-[var(--accent-color)]" />
              <span>የመስቀለኛ ማጣቀሻዎች • Cross-References (TSK)</span>
            </div>
            <span className="text-[10px] font-mono text-[var(--accent-color)] font-semibold">
              {bookName} {chapter}:{verseNum}
            </span>
          </div>

          <div className="space-y-2">
            {crossRefs.map((ref, rIdx) => {
              const refLabel = `${ref.target_book_name} ${ref.target_chapter}:${ref.target_verse_start}${
                ref.target_verse_end ? `-${ref.target_verse_end}` : ''
              }`;

              return (
                <div
                  key={rIdx}
                  onClick={(e) => handleJumpToRef(ref, e)}
                  className="p-2.5 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--border-color)]/40 border border-[var(--border-color)] transition-all cursor-pointer group shadow-sm space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[var(--accent-color)] group-hover:underline flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      {refLabel}
                    </span>
                    <button
                      onClick={(e) => handleJumpToRef(ref, e)}
                      className="flex items-center space-x-0.5 px-2 py-0.5 rounded bg-[var(--bg-secondary)] text-[10px] font-bold text-[var(--text-secondary)] group-hover:text-[var(--accent-color)]"
                    >
                      <span>Read</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </button>
                  </div>

                  {ref.theme && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] block">
                      Theme: {ref.theme}
                    </span>
                  )}

                  {ref.preview_text_am && (
                    <p className="font-eth text-xs text-[var(--text-primary)] leading-relaxed bg-[var(--bg-secondary)]/50 p-2 rounded-lg">
                      {ref.preview_text_am}
                    </p>
                  )}

                  {ref.preview_text_en && (
                    <p className="text-[11px] text-[var(--text-secondary)] italic leading-relaxed">
                      "{ref.preview_text_en}"
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
