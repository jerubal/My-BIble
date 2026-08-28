'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Book, Translation, DailyVerse } from '@/lib/types';
import { BibleHero } from '@/components/BibleHero';
import { BookOpen, Sparkles, ArrowRight, Library, Languages, History } from 'lucide-react';

interface CoverDashboardProps {
  books: Book[];
  translations: Translation[];
  dailyVerse: DailyVerse | null;
  onNavigateToTab: (tab: 'books' | 'translations') => void;
  onOpenDailyVerseModal: () => void;
}

export function CoverDashboard({
  books,
  translations,
  dailyVerse,
  onNavigateToTab,
  onOpenDailyVerseModal,
}: CoverDashboardProps) {
  const [lastRead, setLastRead] = useState<{ bookSlug: string; bookName: string; chapter: number } | null>(null);

  useEffect(() => {
    try {
      const savedBook = localStorage.getItem('ruth_last_book') || 'genesis';
      const savedChapter = parseInt(localStorage.getItem('ruth_last_chapter') || '1', 10);
      const matched = books.find((b) => b.slug === savedBook) || books[0];
      if (matched) {
        setLastRead({
          bookSlug: matched.slug,
          bookName: matched.name_en,
          chapter: savedChapter,
        });
      }
    } catch (e) {}
  }, [books]);

  const defaultBook = books[0] || { slug: 'genesis', name_en: 'Genesis', chapter_count: 50 };
  const continueLink = lastRead
    ? `/read/${lastRead.bookSlug}/${lastRead.chapter}`
    : `/read/${defaultBook.slug}/1`;

  const heroVerseText =
    dailyVerse?.verses?.['am-1875'] ||
    'በመጀመሪያ እግዚአብሔር ሰማይንና ምድርን ፈጠረ።';
  const heroVerseRef = dailyVerse?.book
    ? `${dailyVerse.book.name_am || dailyVerse.book.name_en} ${dailyVerse.chapter}፥${dailyVerse.verse_num}`
    : 'ኦሪት ዘፍጥረት 1፥1';

  return (
    <div className="space-y-6 sm:space-y-10 animate-fadeIn w-full overflow-hidden">
      {/* Hero Cover Banner */}
      <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-[var(--border-color)]">
        <BibleHero
          title="መጽሐፍ ቅዱስ"
          words={['Davar', 'Emet', 'Ruach']}
          verse={{
            text: heroVerseText,
            reference: heroVerseRef,
          }}
          backgroundSrc="/images/hero-book.jpg"
        />
      </div>

      {/* Quick Action Band: Continue Reading & Primary Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Card 1: Continue Reading / Jump In */}
        <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[var(--bg-surface)] to-[var(--bg-secondary)] border border-[var(--border-color)] shadow-sm hover:border-[var(--accent-color)]/50 transition-all flex flex-col justify-between group">
          <div className="space-y-2.5 sm:space-y-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[var(--accent-color)]/10 text-[var(--accent-color)] flex items-center justify-center font-bold">
              <History className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[var(--accent-color)]">
                {lastRead ? 'Resume Reading' : 'Start Reading'}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] mt-0.5">
                {lastRead ? `${lastRead.bookName} ${lastRead.chapter}` : `${defaultBook.name_en} 1`}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                {lastRead
                  ? 'Pick up right where you left off in scripture.'
                  : 'Begin from Genesis in your preferred translation.'}
              </p>
            </div>
          </div>

          <div className="pt-4 sm:pt-6">
            <Link
              href={continueLink}
              className="w-full inline-flex items-center justify-center space-x-2 py-2.5 sm:py-3 px-4 rounded-xl sm:rounded-2xl bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white text-xs font-bold transition-transform active:scale-95 shadow-md shadow-[var(--accent-color)]/20"
            >
              <BookOpen className="w-4 h-4" />
              <span>{lastRead ? 'Continue Reading' : 'Start from Genesis'}</span>
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Card 2: 66-Book Scripture Explorer */}
        <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[var(--bg-surface)] to-[var(--bg-secondary)] border border-[var(--border-color)] shadow-sm hover:border-[var(--accent-color)]/50 transition-all flex flex-col justify-between group">
          <div className="space-y-2.5 sm:space-y-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Library className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Biblical Canon
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] mt-0.5">
                66 Books Explorer
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Browse Old & New Testament canonical books with full Amharic & English texts.
              </p>
            </div>
          </div>

          <div className="pt-4 sm:pt-6">
            <button
              onClick={() => onNavigateToTab('books')}
              className="w-full inline-flex items-center justify-center space-x-2 py-2.5 sm:py-3 px-4 rounded-xl sm:rounded-2xl bg-[var(--bg-primary)] hover:bg-[var(--border-color)] border border-[var(--border-color)] text-[var(--text-primary)] text-xs font-bold transition-all group-hover:border-[var(--accent-color)]"
            >
              <Library className="w-4 h-4 text-[var(--accent-color)]" />
              <span>Open 66 Books Library</span>
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform text-[var(--accent-color)]" />
            </button>
          </div>
        </div>

        {/* Card 3: Translations & Manuscripts */}
        <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[var(--bg-surface)] to-[var(--bg-secondary)] border border-[var(--border-color)] shadow-sm hover:border-[var(--accent-color)]/50 transition-all flex flex-col justify-between group">
          <div className="space-y-2.5 sm:space-y-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Languages className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Translations Catalog
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] mt-0.5">
                {translations.length} Translations & Texts
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                KJV, WEB, ASV, Amplified, Complete Jewish, 1879 Amharic, Hebrew WLC, and Greek.
              </p>
            </div>
          </div>

          <div className="pt-4 sm:pt-6">
            <button
              onClick={() => onNavigateToTab('translations')}
              className="w-full inline-flex items-center justify-center space-x-2 py-2.5 sm:py-3 px-4 rounded-xl sm:rounded-2xl bg-[var(--bg-primary)] hover:bg-[var(--border-color)] border border-[var(--border-color)] text-[var(--text-primary)] text-xs font-bold transition-all group-hover:border-emerald-500"
            >
              <Languages className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Explore All Translations</span>
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform text-emerald-600 dark:text-emerald-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Featured Section: Verse of the Day Spotlight */}
      <div className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
        <div className="space-y-2 sm:space-y-3 max-w-2xl">
          <div className="flex items-center space-x-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--accent-color)]">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Verse of the Day • ዕለታዊ ቃል</span>
          </div>
          <blockquote className="text-base sm:text-xl font-eth leading-relaxed text-[var(--text-primary)]">
            &ldquo;{heroVerseText}&rdquo;
          </blockquote>
          <p className="text-xs sm:text-sm font-semibold text-[var(--accent-color)] font-serif">
            {heroVerseRef}
          </p>
        </div>

        <button
          onClick={onOpenDailyVerseModal}
          className="w-full md:w-auto shrink-0 inline-flex items-center justify-center space-x-2 px-4 sm:px-5 py-2.5 rounded-xl sm:rounded-2xl bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] text-[var(--text-primary)] text-xs font-bold border border-[var(--border-color)] transition-colors shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Compare Languages</span>
        </button>
      </div>

      {/* Canonical Stats & Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 py-2 text-center">
        <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
          <span className="block text-xl sm:text-3xl font-black text-[var(--accent-color)] font-mono">66</span>
          <span className="text-[11px] sm:text-xs text-[var(--text-secondary)] font-medium">Canonical Books</span>
        </div>
        <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
          <span className="block text-xl sm:text-3xl font-black text-[var(--accent-color)] font-mono">1,189</span>
          <span className="text-[11px] sm:text-xs text-[var(--text-secondary)] font-medium">Chapters Synced</span>
        </div>
        <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
          <span className="block text-xl sm:text-3xl font-black text-[var(--accent-color)] font-mono">4+</span>
          <span className="text-[11px] sm:text-xs text-[var(--text-secondary)] font-medium">Languages</span>
        </div>
        <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
          <span className="block text-xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">100%</span>
          <span className="text-[11px] sm:text-xs text-[var(--text-secondary)] font-medium">Open Public Domain</span>
        </div>
      </div>
    </div>
  );
}
