'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { ChapterData, Book, Translation } from '@/lib/types';
import { Header } from '@/components/navigation/Header';
import { ReaderControls } from '@/components/reader/ReaderControls';
import { ParallelReader } from '@/components/reader/ParallelReader';
import { BookChapterSelector } from '@/components/navigation/BookChapterSelector';
import { TranslationInfoModal } from '@/components/reader/TranslationInfoModal';
import { DailyVerseModal } from '@/components/reader/DailyVerseModal';
import { SearchModal } from '@/components/search/SearchModal';
import { SavedVersesModal } from '@/components/reader/SavedVersesModal';
import { recordChapterRead } from '@/lib/reading-tracker';
import { ChevronRight } from 'lucide-react';

interface ReaderClientProps {
  initialData: ChapterData;
  allBooks: Book[];
  allTranslations: Translation[];
}

export function ReaderClient({
  initialData,
  allBooks,
  allTranslations,
}: ReaderClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const translationParam = searchParams.get('t');

  // Reader state
  const [data, setData] = useState<ChapterData>(initialData);
  const [fontSize, setFontSize] = useState<number>(18);
  
  // Default to single translation mode
  const [isParallelMode, setIsParallelMode] = useState<boolean>(false);
  const [parallelLayout, setParallelLayout] = useState<'columns' | 'stacked'>('columns');
  const [primaryTranslationCode, setPrimaryTranslationCode] = useState<string>(
    translationParam || 'am-1875'
  );
  const [parallelTranslationCodes, setParallelTranslationCodes] = useState<string[]>([
    'am-1875',
    'am-2001',
    'eng-kjv',
    'heb-wlc',
    'grc-sblgnt',
  ]);

  const [theme, setTheme] = useState<string>('sepia');
  const [showControls, setShowControls] = useState<boolean>(true);

  // Modal states
  const [isBookSelectorOpen, setIsBookSelectorOpen] = useState(false);
  const [isAttributionOpen, setIsAttributionOpen] = useState(false);
  const [isDailyVerseOpen, setIsDailyVerseOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSavedVersesOpen, setIsSavedVersesOpen] = useState(false);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  // Persist reading position and record truthful reading analytics
  useEffect(() => {
    try {
      if (data?.book?.slug) {
        recordChapterRead(
          data.book.slug,
          data.book.name_en,
          data.chapter,
          data.verses?.length || 20,
          data.book.name_am
        );
      }
    } catch (e) {}
  }, [data]);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const savedFontSize = localStorage.getItem('ruth_font_size');
      if (savedFontSize) setFontSize(parseInt(savedFontSize, 10));

      if (!translationParam) {
        const savedPrimaryTrans = localStorage.getItem('ruth_primary_translation');
        if (savedPrimaryTrans) setPrimaryTranslationCode(savedPrimaryTrans);
      } else {
        setPrimaryTranslationCode(translationParam);
      }

      const savedParallelMode = localStorage.getItem('ruth_parallel_mode');
      if (savedParallelMode !== null) setIsParallelMode(savedParallelMode === 'true');

      const savedParallelLayout = localStorage.getItem('ruth_parallel_layout');
      if (savedParallelLayout === 'columns' || savedParallelLayout === 'stacked') {
        setParallelLayout(savedParallelLayout);
      }

      const savedTheme = localStorage.getItem('ruth_theme');
      if (savedTheme) {
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
      }

      const savedParallelTranslations = localStorage.getItem('ruth_parallel_translations');
      if (savedParallelTranslations) {
        const parsed = JSON.parse(savedParallelTranslations);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setParallelTranslationCodes(parsed);
        }
      }
    } catch (e) {
      console.warn('Could not read from localStorage:', e);
    }
  }, [translationParam]);

  // Handlers with persistence
  const handleSetTheme = (newTheme: string) => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    try {
      localStorage.setItem('ruth_theme', newTheme);
    } catch (e) {}
  };

  const handleSetFontSize = (newSize: number) => {
    setFontSize(newSize);
    try {
      localStorage.setItem('ruth_font_size', newSize.toString());
    } catch (e) {}
  };

  const handleSetPrimaryTranslation = (code: string) => {
    setPrimaryTranslationCode(code);
    try {
      localStorage.setItem('ruth_primary_translation', code);
    } catch (e) {}

    // Update URL query param quietly
    const url = new URL(window.location.href);
    url.searchParams.set('t', code);
    router.replace(url.pathname + url.search, { scroll: false });
  };

  const handleSetIsParallelMode = (parallel: boolean) => {
    setIsParallelMode(parallel);
    try {
      localStorage.setItem('ruth_parallel_mode', parallel.toString());
    } catch (e) {}
  };

  const handleSetParallelLayout = (layout: 'columns' | 'stacked') => {
    setParallelLayout(layout);
    try {
      localStorage.setItem('ruth_parallel_layout', layout);
    } catch (e) {}
  };

  const handleToggleParallelTranslation = (code: string) => {
    let next: string[];
    if (parallelTranslationCodes.includes(code)) {
      if (parallelTranslationCodes.length <= 1) return;
      next = parallelTranslationCodes.filter((c) => c !== code);
    } else {
      next = [...parallelTranslationCodes, code];
    }
    setParallelTranslationCodes(next);
    try {
      localStorage.setItem('ruth_parallel_translations', JSON.stringify(next));
    } catch (e) {}
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] w-full overflow-x-hidden">
      {/* Top Header */}
      <Header
        currentBook={data.book}
        currentChapter={data.chapter}
        onOpenBookSelector={() => setIsBookSelectorOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenDailyVerse={() => setIsDailyVerseOpen(true)}
        onOpenSavedVerses={() => setIsSavedVersesOpen(true)}
        onToggleControls={() => setShowControls((prev) => !prev)}
        showControls={showControls}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6 overflow-hidden">
        {/* Breadcrumb back navigation */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 text-[11px] sm:text-xs text-[var(--text-muted)] overflow-x-auto no-scrollbar py-0.5">
          <Link href="/" className="hover:text-[var(--accent-color)] transition-colors whitespace-nowrap">
            Library
          </Link>
          <ChevronRight className="w-3 h-3 text-[var(--text-muted)] shrink-0" />
          <Link href={`/read/${data.book.slug}`} className="hover:text-[var(--accent-color)] transition-colors font-medium whitespace-nowrap truncate max-w-[120px] sm:max-w-none">
            {data.book.name_en} {data.book.name_am ? `(${data.book.name_am})` : ''}
          </Link>
          <ChevronRight className="w-3 h-3 text-[var(--text-muted)] shrink-0" />
          <span className="text-[var(--text-primary)] font-semibold whitespace-nowrap">
            Chapter {data.chapter}
          </span>
        </div>

        {/* Collapsible Reader Controls */}
        {showControls && (
          <div className="animate-fadeIn">
            <ReaderControls
              fontSize={fontSize}
              setFontSize={handleSetFontSize}
              isParallelMode={isParallelMode}
              setIsParallelMode={handleSetIsParallelMode}
              parallelLayout={parallelLayout}
              setParallelLayout={handleSetParallelLayout}
              availableTranslations={allTranslations}
              primaryTranslationCode={primaryTranslationCode}
              setPrimaryTranslationCode={handleSetPrimaryTranslation}
              parallelTranslationCodes={parallelTranslationCodes}
              onToggleParallelTranslation={handleToggleParallelTranslation}
              theme={theme}
              setTheme={handleSetTheme}
              onOpenAttribution={() => setIsAttributionOpen(true)}
              onOpenSavedVerses={() => setIsSavedVersesOpen(true)}
            />
          </div>
        )}

        {/* Scripture Reader */}
        <ParallelReader
          data={data}
          fontSize={fontSize}
          isParallelMode={isParallelMode}
          parallelLayout={parallelLayout}
          primaryTranslationCode={primaryTranslationCode}
          parallelTranslationCodes={parallelTranslationCodes}
          onChangePrimaryTranslation={handleSetPrimaryTranslation}
          allTranslations={allTranslations}
          onOpenSavedModal={() => setIsSavedVersesOpen(true)}
        />
      </main>

      {/* Modals and Drawers */}
      <BookChapterSelector
        isOpen={isBookSelectorOpen}
        onClose={() => setIsBookSelectorOpen(false)}
        books={allBooks}
        currentBook={data.book}
        currentChapter={data.chapter}
      />

      <TranslationInfoModal
        isOpen={isAttributionOpen}
        onClose={() => setIsAttributionOpen(false)}
        translations={allTranslations}
      />

      <DailyVerseModal
        isOpen={isDailyVerseOpen}
        onClose={() => setIsDailyVerseOpen(false)}
        translations={allTranslations}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        translations={allTranslations}
      />

      <SavedVersesModal
        isOpen={isSavedVersesOpen}
        onClose={() => setIsSavedVersesOpen(false)}
      />
    </div>
  );
}
