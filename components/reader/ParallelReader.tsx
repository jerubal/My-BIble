'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChapterData, Translation, SavedFavorite, SavedHighlight, SavedNote, HighlightColor } from '@/lib/types';
import { MorphologyModal } from '@/components/study/MorphologyModal';
import { CrossReferencesModal } from '@/components/study/CrossReferencesModal';
import { VerseNoteModal } from '@/components/reader/VerseNoteModal';
import { AudioPlayerBar } from '@/components/audio/AudioPlayerBar';
import { InlineVerseStudyStrip } from '@/components/reader/InlineVerseStudyStrip';
import { ToolsBottomSheet } from '@/components/reader/ToolsBottomSheet';
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Languages,
  Star,
  Highlighter,
  X,
  Volume2,
  FileText,
  Link2,
  Sparkles,
} from 'lucide-react';

interface ParallelReaderProps {
  data: ChapterData;
  fontSize: number;
  isParallelMode: boolean;
  parallelLayout: 'columns' | 'stacked';
  primaryTranslationCode: string;
  parallelTranslationCodes: string[];
  onChangePrimaryTranslation?: (code: string) => void;
  allTranslations: Translation[];
  onOpenSavedModal?: () => void;
}

export function ParallelReader({
  data,
  fontSize,
  isParallelMode,
  parallelLayout,
  primaryTranslationCode,
  parallelTranslationCodes,
  onChangePrimaryTranslation,
  allTranslations,
  onOpenSavedModal,
}: ParallelReaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const highlightedVerseParam = searchParams.get('v') ? parseInt(searchParams.get('v')!, 10) : null;

  const [activeVerseNum, setActiveVerseNum] = useState<number | null>(highlightedVerseParam);
  const [copiedVerseNum, setCopiedVerseNum] = useState<number | null>(null);

  // Local storage state for favorites, highlights, and notes
  const [favorites, setFavorites] = useState<Record<string, SavedFavorite>>({});
  const [highlights, setHighlights] = useState<Record<string, SavedHighlight>>({});
  const [notes, setNotes] = useState<Record<string, SavedNote>>({});

  // Study modals and tools sheet state
  const [isAudioOpen, setIsAudioOpen] = useState<boolean>(false);
  const [isToolsSheetOpen, setIsToolsSheetOpen] = useState<boolean>(false);
  const [isMorphologyOpen, setIsMorphologyOpen] = useState<boolean>(false);
  const [isCrossRefOpen, setIsCrossRefOpen] = useState<boolean>(false);
  const [isNoteEditorOpen, setIsNoteEditorOpen] = useState<boolean>(false);
  const [selectedVerseForModal, setSelectedVerseForModal] = useState<number>(1);

  const loadUserData = () => {
    try {
      const favStr = localStorage.getItem('ruth_favorites');
      if (favStr) setFavorites(JSON.parse(favStr));

      const hlStr = localStorage.getItem('ruth_highlights');
      if (hlStr) setHighlights(JSON.parse(hlStr));

      const notesStr = localStorage.getItem('ruth_notes');
      if (notesStr) setNotes(JSON.parse(notesStr));
    } catch (e) {
      console.warn('Error reading local data:', e);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (highlightedVerseParam) {
      setActiveVerseNum(highlightedVerseParam);
      const el = document.getElementById(`verse-${highlightedVerseParam}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [highlightedVerseParam]);

  // Determine active translations to display (Strictly enforce is_active)
  const activeTranslations: Translation[] = isParallelMode
    ? allTranslations.filter((t) => t.is_active && parallelTranslationCodes.includes(t.code))
    : allTranslations.filter((t) => t.is_active && t.code === primaryTranslationCode);

  const resolvedTranslations =
    activeTranslations.length > 0
      ? activeTranslations
      : [allTranslations.find((t) => t.code === 'am-1875' && t.is_active) || allTranslations.find((t) => t.is_active) || allTranslations[0]];

  const activeTranslation = resolvedTranslations[0];

  const getVerseKey = (verseNum: number) => `${data.book.slug}-${data.chapter}-${verseNum}`;

  const handleSelectVerse = (verseNum: number) => {
    setActiveVerseNum(activeVerseNum === verseNum ? null : verseNum);
    setSelectedVerseForModal(verseNum);
    const url = new URL(window.location.href);
    if (activeVerseNum === verseNum) {
      url.searchParams.delete('v');
    } else {
      url.searchParams.set('v', verseNum.toString());
    }
    router.replace(url.pathname + url.search, { scroll: false });
  };

  const handleToggleFavorite = (verseNum: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const key = getVerseKey(verseNum);
    const verseObj = data.verses.find((v) => v.verse_num === verseNum);
    const currentText = verseObj?.translations[activeTranslation.code]?.text || '';

    const nextFavs = { ...favorites };
    if (nextFavs[key]) {
      delete nextFavs[key];
    } else {
      nextFavs[key] = {
        id: key,
        book_slug: data.book.slug,
        book_name: data.book.name_en,
        chapter: data.chapter,
        verse_num: verseNum,
        translation_code: activeTranslation.code,
        verse_text: currentText,
        created_at: new Date().toISOString(),
      };
    }

    setFavorites(nextFavs);
    try {
      localStorage.setItem('ruth_favorites', JSON.stringify(nextFavs));
    } catch (err) {}
  };

  const handleSetHighlightColor = (verseNum: number, color: HighlightColor | null, e: React.MouseEvent) => {
    e.stopPropagation();
    const key = getVerseKey(verseNum);
    const verseObj = data.verses.find((v) => v.verse_num === verseNum);
    const currentText = verseObj?.translations[activeTranslation.code]?.text || '';

    const nextHls = { ...highlights };
    if (!color) {
      delete nextHls[key];
    } else {
      nextHls[key] = {
        id: key,
        book_slug: data.book.slug,
        book_name: data.book.name_en,
        chapter: data.chapter,
        verse_num: verseNum,
        color: color,
        translation_code: activeTranslation.code,
        verse_text: currentText,
        created_at: new Date().toISOString(),
      };
    }

    setHighlights(nextHls);
    try {
      localStorage.setItem('ruth_highlights', JSON.stringify(nextHls));
    } catch (err) {}
  };

  const handleCopyVerse = (verseNum: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const verseObj = data.verses.find((v) => v.verse_num === verseNum);
    if (!verseObj) return;

    let textToCopy = `📖 ${data.book.name_en} ${data.chapter}:${verseNum}\n\n`;
    for (const tr of resolvedTranslations) {
      const vText = verseObj.translations[tr.code]?.text || '';
      if (vText) {
        textToCopy += `[${tr.language} - ${tr.name}]:\n${vText}\n\n`;
      }
    }
    textToCopy += `Read on Multilingual Bible App: ${window.location.href}`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedVerseNum(verseNum);
    setTimeout(() => setCopiedVerseNum(null), 2500);
  };

  const getScriptClass = (code: string) => {
    if (code.startsWith('amh') || code.startsWith('am-')) return 'script-amharic font-amharic';
    if (code.startsWith('heb')) return 'script-hebrew font-hebrew';
    if (code.startsWith('grc')) return 'script-greek font-greek';
    return 'script-english font-serif';
  };

  // Full 12-Color Highlighting Palette
  const highlightColors: Array<{ id: HighlightColor; name: string; dot: string }> = [
    { id: 'yellow', name: 'Sun Yellow', dot: '#eab308' },
    { id: 'gold', name: 'Gold', dot: '#d97706' },
    { id: 'orange', name: 'Orange', dot: '#f97316' },
    { id: 'green', name: 'Mint Green', dot: '#22c55e' },
    { id: 'emerald', name: 'Emerald', dot: '#16a34a' },
    { id: 'cyan', name: 'Cyan', dot: '#06b6d4' },
    { id: 'blue', name: 'Sky Blue', dot: '#0284c7' },
    { id: 'indigo', name: 'Indigo', dot: '#4f46e5' },
    { id: 'purple', name: 'Purple', dot: '#a855f7' },
    { id: 'pink', name: 'Pink', dot: '#db2777' },
    { id: 'rose', name: 'Rose', dot: '#f43f5e' },
    { id: 'slate', name: 'Slate', dot: '#64748b' },
  ];

  // Ribbon quick switcher (All Amharic translations 1879, 1954, 1997, 2001 + English, Hebrew, Greek)
  const quickSwitchCodes = [
    { code: 'am-1875', label: 'አማ · 1879' },
    { code: 'am-1954', label: 'አማ · 1954' },
    { code: 'am-1997', label: 'አማ · 1997' },
    { code: 'am-2001', label: 'አማ · 2001' },
    { code: 'eng-kjv', label: 'EN · KJV' },
    { code: 'eng-web', label: 'WEB' },
    { code: 'heb-wlc', label: 'עב · WLC' },
    { code: 'grc-sblgnt', label: 'GR · NT' },
  ];

  const selectedVerseObj = data.verses.find((v) => v.verse_num === selectedVerseForModal);
  const selectedVerseText = selectedVerseObj?.translations[activeTranslation.code]?.text || '';
  const selectedVerseOriginal =
    selectedVerseObj?.translations['heb-wlc']?.text ||
    selectedVerseObj?.translations['grc-sblgnt']?.text ||
    '';

  const isOldTestament = data.book.testament === 'old';

  return (
    <div className="space-y-4 sm:space-y-6 w-full overflow-hidden pb-20 relative">
      {/* Chapter Title & Localized Header */}
      <div className="text-center py-4 sm:py-6 border-b border-[var(--border-color)] relative">
        <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[var(--accent-color)] font-bold mb-1 block">
          {isOldTestament ? 'ብሉይ ኪዳን • Old Testament' : 'ሐዲስ ኪዳን • New Testament'}
        </span>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--text-primary)]">
          {data.book.name_en} {data.chapter}
        </h1>
        <div className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1.5 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {data.book.name_am && (
            <span className="font-amharic text-base sm:text-lg">
              {data.book.name_am} ምዕራፍ {data.chapter}
            </span>
          )}
          {data.book.name_he && (
            <span className="font-hebrew text-sm sm:text-base">
              {data.book.name_he} {data.chapter}
            </span>
          )}
          {data.book.name_gr && (
            <span className="font-greek italic text-xs sm:text-sm">
              {data.book.name_gr} {data.chapter}
            </span>
          )}
        </div>

        {/* Listen Audio Button */}
        <div className="mt-3.5 flex items-center justify-center">
          <button
            onClick={() => setIsAudioOpen(true)}
            className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-[var(--gold-gradient)] text-[#241c08] text-xs font-bold shadow-md hover:brightness-105 transition-all active:scale-95"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>ድምፅ አዳምጥ • Listen Audio</span>
          </button>
        </div>
      </div>

      {/* Main Single Reader View */}
      {!isParallelMode ? (
        <div className="max-w-3xl mx-auto rounded-2xl sm:rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] p-4 sm:p-8 md:p-10 shadow-sm space-y-4 sm:space-y-6">
          {/* Ribbon Strip for Quick Translation Switching (Matching Concept) */}
          <div className="ribbon-strip">
            {quickSwitchCodes.map((item) => {
              const isCurrent = primaryTranslationCode === item.code;
              return (
                <button
                  key={item.code}
                  onClick={() => onChangePrimaryTranslation && onChangePrimaryTranslation(item.code)}
                  className={`ribbon-pill ${isCurrent ? 'active' : ''}`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Active Translation Toolbar & Dropdown */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 sm:pb-4 border-b border-[var(--border-color)]">
            <div className="flex items-center space-x-2 min-w-0">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-color)] shrink-0">
                {activeTranslation.language}
              </span>
              <span className="text-xs text-[var(--text-muted)] truncate" title={activeTranslation.name}>
                — {activeTranslation.name}
              </span>
            </div>

            {/* Translation Dropdown */}
            {onChangePrimaryTranslation && (
              <div className="flex items-center space-x-2 shrink-0">
                <Languages className="w-4 h-4 text-[var(--accent-color)] shrink-0" />
                <select
                  value={primaryTranslationCode}
                  onChange={(e) => onChangePrimaryTranslation(e.target.value)}
                  className="w-full sm:w-auto text-xs font-bold px-2.5 py-1.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] cursor-pointer"
                >
                  <optgroup label="Amharic • አማርኛ (Public Domain)">
                    {allTranslations
                      .filter((t) => t.language === 'Amharic' && t.is_active)
                      .map((tr) => (
                        <option key={tr.code} value={tr.code}>
                          {tr.short_code || tr.code} — {tr.name}
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="English (Public Domain & Open)">
                    {allTranslations
                      .filter((t) => t.language === 'English' && t.is_active)
                      .map((tr) => (
                        <option key={tr.code} value={tr.code}>
                          {tr.short_code || tr.code} — {tr.name}
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="Original Manuscripts (Hebrew & Greek)">
                    {allTranslations
                      .filter((t) => (t.language === 'Hebrew' || t.language === 'Greek') && t.is_active)
                      .map((tr) => (
                        <option key={tr.code} value={tr.code}>
                          {tr.short_code || tr.code} — {tr.name}
                        </option>
                      ))}
                  </optgroup>
                </select>
              </div>
            )}
          </div>

          {/* Verses Flow */}
          <div
            className="space-y-4 divide-y divide-[var(--border-color)]/60 divide-dashed"
            dir={activeTranslation.script_direction}
          >
            {data.verses.map((verse) => {
              const verseData = verse.translations[activeTranslation.code];
              const isSelected = activeVerseNum === verse.verse_num;
              const isRtl = activeTranslation.script_direction === 'rtl';
              const vKey = getVerseKey(verse.verse_num);
              const isFav = !!favorites[vKey];
              const hasNote = !!notes[vKey];
              const hlData = highlights[vKey];

              // Original text for this verse (Hebrew OT / Greek NT)
              const origVerseText = isOldTestament
                ? verse.translations['heb-wlc']?.text
                : verse.translations['grc-sblgnt']?.text || verse.translations['grc-tr']?.text;

              const isFirstVerse = verse.verse_num === 1;
              const isEnglishScript = !activeTranslation.code.startsWith('am') && !activeTranslation.code.startsWith('heb');

              return (
                <div
                  key={verse.verse_num}
                  id={`verse-${verse.verse_num}`}
                  onClick={() => handleSelectVerse(verse.verse_num)}
                  className={`pt-3 first:pt-0 rounded-2xl p-2.5 sm:p-4 transition-all cursor-pointer ${
                    hlData ? `hl-${hlData.color}` : ''
                  } ${
                    isSelected
                      ? 'ring-2 ring-[var(--accent-color)] shadow-md bg-[var(--bg-secondary)]/70'
                      : !hlData
                      ? 'hover:bg-[var(--bg-secondary)]/50'
                      : ''
                  }`}
                >
                  <div className={`flex items-baseline gap-2.5 sm:gap-3.5 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Verse Number & Badges */}
                    <div className="inline-flex items-center space-x-1 shrink-0 select-none">
                      <span className="vnum">{verse.verse_num}</span>
                      {isFav && (
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500 drop-shadow-sm" />
                      )}
                      {hasNote && (
                        <FileText className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 drop-shadow-sm" />
                      )}
                    </div>

                    {/* Primary Translation Verse Text with Dropcap support */}
                    <div
                      className={`flex-1 text-[var(--text-primary)] leading-relaxed ${getScriptClass(
                        activeTranslation.code
                      )}`}
                      style={{ fontSize: `${fontSize}px` }}
                    >
                      {verseData ? (
                        isFirstVerse && isEnglishScript && verseData.text.length > 1 ? (
                          <p>
                            <span className="dropcap">{verseData.text[0]}</span>
                            {verseData.text.slice(1)}
                          </p>
                        ) : (
                          <p>{verseData.text}</p>
                        )
                      ) : (
                        <span className="italic text-[var(--text-muted)] text-xs">
                          [Verse text from {activeTranslation.name}...]
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Inline Strong's & Cross-References Tabs (Revealed on touch) */}
                  <InlineVerseStudyStrip
                    bookSlug={data.book.slug}
                    bookName={data.book.name_en}
                    testament={data.book.testament}
                    chapter={data.chapter}
                    verseNum={verse.verse_num}
                    originalText={origVerseText}
                  />

                  {/* Interactive Study Action Bar (Shown when selected) */}
                  {isSelected && (
                    <div className="mt-3 pt-2.5 border-t border-[var(--border-color)]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs animate-fadeIn">
                      {/* Left: 12-Color Palette Chooser */}
                      <div className="flex items-center space-x-1 flex-wrap gap-y-1">
                        <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] mr-1 flex items-center shrink-0">
                          <Highlighter className="w-3 h-3 mr-1 text-[var(--accent-color)]" /> Color:
                        </span>
                        {highlightColors.map((c) => {
                          const isCurrentColor = hlData?.color === c.id;
                          return (
                            <button
                              key={c.id}
                              onClick={(e) => handleSetHighlightColor(verse.verse_num, c.id, e)}
                              className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full transition-transform active:scale-90 flex items-center justify-center ${
                                isCurrentColor ? 'ring-2 ring-offset-1 ring-[var(--accent-color)] scale-110' : 'hover:scale-110'
                              }`}
                              style={{ backgroundColor: c.dot }}
                              title={`Highlight in ${c.name}`}
                              aria-label={`Highlight in ${c.name}`}
                            >
                              {isCurrentColor && <Check className="w-3 h-3 text-white drop-shadow" />}
                            </button>
                          );
                        })}

                        {hlData && (
                          <button
                            onClick={(e) => handleSetHighlightColor(verse.verse_num, null, e)}
                            className="p-1 rounded-full hover:bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-rose-500 transition-colors ml-1"
                            title="Clear Highlight"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Right: Study & Save Tools */}
                      <div className="flex items-center space-x-1.5 sm:space-x-2 flex-wrap shrink-0">
                        {/* Note Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedVerseForModal(verse.verse_num);
                            setIsNoteEditorOpen(true);
                          }}
                          className={`inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl border text-xs font-semibold shadow-sm transition-all ${
                            hasNote
                              ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border-emerald-500'
                              : 'bg-[var(--bg-surface)] hover:bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-primary)]'
                          }`}
                          title="Personal Study Note"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Note</span>
                        </button>

                        {/* Full Morphology Modal Trigger */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedVerseForModal(verse.verse_num);
                            setIsMorphologyOpen(true);
                          }}
                          className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs font-semibold text-[var(--accent-color)] shadow-sm transition-all"
                          title="Greek / Hebrew Morphology & Strong's"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Morphology</span>
                        </button>

                        {/* Full Cross-Ref Modal Trigger */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedVerseForModal(verse.verse_num);
                            setIsCrossRefOpen(true);
                          }}
                          className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-secondary)] shadow-sm transition-all"
                          title="Cross References"
                        >
                          <Link2 className="w-3.5 h-3.5" />
                          <span>Cross-Ref</span>
                        </button>

                        {/* Favorite Button */}
                        <button
                          onClick={(e) => handleToggleFavorite(verse.verse_num, e)}
                          className={`inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-sm ${
                            isFav
                              ? 'bg-amber-500 text-white border-amber-600'
                              : 'bg-[var(--bg-surface)] hover:bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-primary)]'
                          }`}
                        >
                          <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-white' : 'text-amber-500'}`} />
                        </button>

                        {/* Copy Button */}
                        <button
                          onClick={(e) => handleCopyVerse(verse.verse_num, e)}
                          className="p-1.5 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] transition-colors"
                          title="Copy verse"
                        >
                          {copiedVerseNum === verse.verse_num ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Parallel Columns / Stacked View (Matching Concept) */
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="ribbon-strip">
            <span className="ribbon-pill active">
              {resolvedTranslations.map((t) => t.short_code || t.code).join(' + ')}
            </span>
          </div>

          {data.verses.map((verse) => {
            const isSelected = activeVerseNum === verse.verse_num;
            const vKey = getVerseKey(verse.verse_num);
            const isFav = !!favorites[vKey];
            const hasNote = !!notes[vKey];
            const hlData = highlights[vKey];

            const origVerseText = isOldTestament
              ? verse.translations['heb-wlc']?.text
              : verse.translations['grc-sblgnt']?.text || verse.translations['grc-tr']?.text;

            return (
              <div
                key={verse.verse_num}
                id={`verse-${verse.verse_num}`}
                onClick={() => handleSelectVerse(verse.verse_num)}
                className={`rounded-2xl p-4 sm:p-5 transition-all cursor-pointer border ${
                  hlData ? `hl-${hlData.color}` : ''
                } ${
                  isSelected
                    ? 'ring-2 ring-[var(--accent-color)] shadow-md bg-[var(--bg-secondary)]/80'
                    : !hlData
                    ? 'bg-[var(--bg-surface)] border-[var(--border-color)] hover:border-[var(--accent-color)] shadow-sm'
                    : ''
                }`}
              >
                <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[var(--border-color)]/60 text-xs">
                  <div className="flex items-center space-x-1.5">
                    <span className="vnum font-bold">
                      Verse {verse.verse_num}
                    </span>
                    {isFav && <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />}
                    {hasNote && <FileText className="w-3.5 h-3.5 text-emerald-600" />}
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVerseForModal(verse.verse_num);
                        setIsMorphologyOpen(true);
                      }}
                      className="p-1.5 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--accent-color)]"
                      title="Morphology"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVerseForModal(verse.verse_num);
                        setIsCrossRefOpen(true);
                      }}
                      className="p-1.5 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)]"
                      title="Cross References"
                    >
                      <Link2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleToggleFavorite(verse.verse_num, e)}
                      className={`p-1.5 rounded-lg ${isFav ? 'text-amber-500' : 'text-[var(--text-muted)]'}`}
                    >
                      <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400' : ''}`} />
                    </button>
                  </div>
                </div>

                <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${resolvedTranslations.length}, minmax(0, 1fr))` }}>
                  {resolvedTranslations.map((tr) => {
                    const verseData = verse.translations[tr.code];
                    const isRtl = tr.script_direction === 'rtl';

                    return (
                      <div
                        key={tr.code}
                        dir={tr.script_direction}
                        className={`p-3 rounded-xl bg-[var(--bg-secondary)]/40 ${isRtl ? 'text-right' : 'text-left'}`}
                      >
                        <div className="text-[10px] font-bold text-[var(--accent-color)] uppercase tracking-wider mb-1">
                          {tr.language} · {tr.short_code || tr.code}
                        </div>
                        <p className={`text-[var(--text-primary)] leading-relaxed ${getScriptClass(tr.code)}`} style={{ fontSize: `${fontSize}px` }}>
                          {verseData ? verseData.text : '[Not available]'}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Inline Study Strip in Parallel Mode too */}
                <InlineVerseStudyStrip
                  bookSlug={data.book.slug}
                  bookName={data.book.name_en}
                  testament={data.book.testament}
                  chapter={data.chapter}
                  verseNum={verse.verse_num}
                  originalText={origVerseText}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Chapter Bottom Navigation */}
      <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 sm:pt-8 pb-6 border-t border-[var(--border-color)]">
        {data.prev_chapter ? (
          <Link
            href={`/read/${data.prev_chapter.book_slug}/${data.prev_chapter.chapter}?t=${primaryTranslationCode}`}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-4 sm:px-5 py-2.5 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)] transition-all shadow-sm group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[var(--accent-color)]" />
            <span>Previous Chapter</span>
          </Link>
        ) : (
          <div />
        )}

        <Link
          href={`/`}
          className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--accent-color)] transition-colors py-1"
        >
          All Chapters of {data.book.name_en}
        </Link>

        {data.next_chapter ? (
          <Link
            href={`/read/${data.next_chapter.book_slug}/${data.next_chapter.chapter}?t=${primaryTranslationCode}`}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-4 sm:px-5 py-2.5 rounded-xl bg-[var(--gold-gradient)] hover:brightness-105 text-[#241c08] text-xs font-bold transition-all shadow-sm group"
          >
            <span>Next Chapter</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        ) : (
          <div />
        )}
      </div>

      {/* Floating Action Button (FAB ✦ from Concept) */}
      <button
        onClick={() => setIsToolsSheetOpen(true)}
        className="fab"
        title="Open Word Study & Tools Drawer"
        aria-label="Open Study Tools"
      >
        ✦
      </button>

      {/* Tools Bottom Sheet Drawer (From Concept) */}
      <ToolsBottomSheet
        isOpen={isToolsSheetOpen}
        onClose={() => setIsToolsSheetOpen(false)}
        bookSlug={data.book.slug}
        bookName={data.book.name_en}
        testament={data.book.testament}
        chapter={data.chapter}
        verseNum={selectedVerseForModal}
        originalText={selectedVerseOriginal}
        verseText={selectedVerseText}
        onOpenNotes={() => setIsNoteEditorOpen(true)}
      />

      {/* Modals & Tools */}
      {isAudioOpen && (
        <AudioPlayerBar
          verses={data.verses}
          activeTranslation={activeTranslation}
          bookName={data.book.name_en}
          chapterNum={data.chapter}
          currentVerseNum={activeVerseNum}
          onVerseChange={(vNum) => {
            setActiveVerseNum(vNum);
            const el = document.getElementById(`verse-${vNum}`);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }}
          onClose={() => setIsAudioOpen(false)}
        />
      )}

      <MorphologyModal
        isOpen={isMorphologyOpen}
        onClose={() => setIsMorphologyOpen(false)}
        bookSlug={data.book.slug}
        bookName={data.book.name_en}
        chapter={data.chapter}
        verseNum={selectedVerseForModal}
        testament={data.book.testament}
        originalText={selectedVerseOriginal}
      />

      <CrossReferencesModal
        isOpen={isCrossRefOpen}
        onClose={() => setIsCrossRefOpen(false)}
        bookSlug={data.book.slug}
        bookName={data.book.name_en}
        chapter={data.chapter}
        verseNum={selectedVerseForModal}
      />

      <VerseNoteModal
        isOpen={isNoteEditorOpen}
        onClose={() => setIsNoteEditorOpen(false)}
        bookSlug={data.book.slug}
        bookName={data.book.name_en}
        chapter={data.chapter}
        verseNum={selectedVerseForModal}
        verseText={selectedVerseText}
        onSaveNote={() => loadUserData()}
      />
    </div>
  );
}
