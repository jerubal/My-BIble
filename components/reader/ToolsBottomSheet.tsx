'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getVerseMorphology } from '@/lib/lexicon';
import { getCrossReferences } from '@/lib/cross-references';
import { Sparkles, Link2, FileText, Search, X, BookOpen, ExternalLink, Copy, Check } from 'lucide-react';

interface ToolsBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  bookSlug: string;
  bookName: string;
  testament: 'old' | 'new';
  chapter: number;
  verseNum: number;
  originalText?: string;
  verseText?: string;
  onOpenNotes?: () => void;
}

export function ToolsBottomSheet({
  isOpen,
  onClose,
  bookSlug,
  bookName,
  testament,
  chapter,
  verseNum,
  originalText,
  verseText,
  onOpenNotes,
}: ToolsBottomSheetProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'study' | 'crossref' | 'notes' | 'search'>('study');
  const [copied, setCopied] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const isHebrew = testament === 'old';
  const morphology = getVerseMorphology(bookSlug, testament, chapter, verseNum, originalText);
  const crossRefs = getCrossReferences(bookSlug, chapter, verseNum);
  const primaryWord = morphology.words[0] || {
    surface_form: isHebrew ? 'עַמֵּךְ עַמִּי' : 'ὁ Λόγος',
    transliteration: isHebrew ? 'ammek ammi' : 'ho Logos',
    strongs_id: isHebrew ? 'H5971' : 'G3056',
    lemma: isHebrew ? 'עַם' : 'λόγος',
    part_of_speech: 'Noun',
    definition_en: isHebrew ? 'People, nation, kinsfolk — covenant belonging.' : 'Word, divine utterance, reason, Christ.',
    definition_am: isHebrew ? 'ሕዝብ፣ ወገን፣ ኪዳናዊ አንድነት።' : 'ቃል፣ መለኮታዊ ቃል፣ ክርስቶስ።',
  };

  const handleCopyWord = () => {
    const text = `[${primaryWord.strongs_id}] ${primaryWord.surface_form} (${primaryWord.transliteration})\n${primaryWord.definition_en}\n${primaryWord.definition_am || ''}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet space-y-3.5" onClick={(e) => e.stopPropagation()}>
        {/* Handle */}
        <div className="sheet-handle" />

        {/* Tab Headers */}
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2.5">
          <div className="flex items-center space-x-4 sm:space-x-6 text-xs sm:text-sm">
            <button
              onClick={() => setActiveTab('study')}
              className={`sheet-tab ${activeTab === 'study' ? 'active' : ''}`}
            >
              ✦ Word Study
            </button>
            <button
              onClick={() => setActiveTab('crossref')}
              className={`sheet-tab ${activeTab === 'crossref' ? 'active' : ''}`}
            >
              🔗 Cross-refs ({crossRefs.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('notes');
                if (onOpenNotes) {
                  onClose();
                  onOpenNotes();
                }
              }}
              className={`sheet-tab ${activeTab === 'notes' ? 'active' : ''}`}
            >
              📝 Notes
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`sheet-tab ${activeTab === 'search' ? 'active' : ''}`}
            >
              ⌕ Search
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab 1: Word Study Card (Matching Concept) */}
        {activeTab === 'study' && (
          <div className="space-y-3 animate-fadeIn">
            <div className="word-study-card space-y-2">
              <div className="flex items-center justify-between">
                <div className={isHebrew ? 'word-original font-hebrew' : 'word-original font-greek'}>
                  {primaryWord.surface_form}
                </div>
                <button
                  onClick={handleCopyWord}
                  className="px-2 py-0.5 rounded bg-[var(--bg-surface)] text-[10px] text-[var(--text-muted)] hover:text-[var(--accent-color)] border border-[var(--border-color)] flex items-center gap-1"
                >
                  {copied ? <Check className="w-2.5 h-2.5 text-emerald-500" /> : <Copy className="w-2.5 h-2.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="word-strong">
                {primaryWord.strongs_id} · <span className="italic">{primaryWord.transliteration}</span> — {primaryWord.part_of_speech}
              </div>

              <div className="word-def">
                {primaryWord.definition_en}
              </div>

              {primaryWord.definition_am && (
                <div className="font-amharic text-xs text-[var(--accent-color)] pt-1 border-t border-[var(--border-color)]/60">
                  {primaryWord.definition_am}
                </div>
              )}
            </div>

            {/* Other words in verse */}
            {morphology.words.length > 1 && (
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider">
                  All Words in {bookName} {chapter}:{verseNum}:
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1" dir={isHebrew ? 'rtl' : 'ltr'}>
                  {morphology.words.slice(1, 8).map((w, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-color)] text-xs flex items-center gap-1"
                    >
                      <span className={isHebrew ? 'font-hebrew' : 'font-greek'}>{w.surface_form}</span>
                      <span className="text-[9px] font-mono text-[var(--accent-color)]">{w.strongs_id}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Cross-References List */}
        {activeTab === 'crossref' && (
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1 animate-fadeIn">
            {crossRefs.map((ref, idx) => (
              <div
                key={idx}
                onClick={() => {
                  onClose();
                  router.push(`/read/${ref.target_book_slug}/${ref.target_chapter}?v=${ref.target_verse_start}`);
                }}
                className="p-2.5 rounded-xl bg-[var(--bg-elevated)] hover:border-[var(--border-gold)] border border-[var(--border-color)] transition-all cursor-pointer space-y-1"
              >
                <div className="flex items-center justify-between text-xs font-bold text-[var(--accent-color)]">
                  <span>{ref.target_book_name} {ref.target_chapter}:{ref.target_verse_start}</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
                {ref.preview_text_en && (
                  <p className="text-[11px] text-[var(--text-secondary)] italic">
                    "{ref.preview_text_en}"
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Fast Search In Chapter */}
        {activeTab === 'search' && (
          <div className="space-y-2.5 animate-fadeIn">
            <div className="search-pill">
              <Search className="w-3.5 h-3.5" />
              <input
                type="text"
                placeholder="Search words in this chapter..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-xs w-full text-[var(--text-primary)] focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">
              Quickly find any phrase or theological term in {bookName} chapter {chapter}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
