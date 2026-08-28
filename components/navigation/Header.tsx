'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Book } from '@/lib/types';
import { BookOpen, Search, Sparkles, ChevronDown, SlidersHorizontal, Star } from 'lucide-react';

interface HeaderProps {
  currentBook: Book;
  currentChapter: number;
  onOpenBookSelector: () => void;
  onOpenSearch: () => void;
  onOpenDailyVerse: () => void;
  onOpenSavedVerses?: () => void;
  onToggleControls: () => void;
  showControls: boolean;
}

export function Header({
  currentBook,
  currentChapter,
  onOpenBookSelector,
  onOpenSearch,
  onOpenDailyVerse,
  onOpenSavedVerses,
  onToggleControls,
  showControls,
}: HeaderProps) {
  const [savedCount, setSavedCount] = useState<number>(0);

  useEffect(() => {
    try {
      const favs = JSON.parse(localStorage.getItem('ruth_favorites') || '{}');
      const hls = JSON.parse(localStorage.getItem('ruth_highlights') || '{}');
      setSavedCount(Object.keys(favs).length + Object.keys(hls).length);
    } catch (e) {}
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[var(--bg-surface)]/95 backdrop-blur-md border-b border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Left: Brand & Home Link */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          <Link
            href="/"
            className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors group"
            title="Return to Book Catalog"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[var(--accent-color)] text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="hidden md:flex flex-col">
              <span className="text-sm font-bold tracking-tight text-[var(--text-primary)]">
                መጽሐፍ ቅዱስ <span className="text-[var(--accent-color)] font-serif font-normal text-xs">Bible</span>
              </span>
              <span className="text-[9px] text-[var(--text-muted)] font-medium">
                4 Languages
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Book & Chapter Navigation Pill */}
        <div className="flex items-center justify-center flex-1 max-w-xs">
          <button
            onClick={onOpenBookSelector}
            className="flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] border border-[var(--border-color)] text-[var(--text-primary)] font-semibold transition-all shadow-sm active:scale-95 text-xs sm:text-sm"
            aria-label="Select book and chapter"
          >
            <span className="truncate max-w-[150px] sm:max-w-[200px]">
              {currentBook.name_en} {currentChapter}
            </span>
            <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--text-muted)] shrink-0" />
          </button>
        </div>

        {/* Right: Actions (Saved Favorites/Highlights, Search, Daily Verse, Controls) */}
        <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
          {/* Saved / Favorites Trigger Button */}
          {onOpenSavedVerses && (
            <button
              onClick={onOpenSavedVerses}
              className="relative p-2 sm:p-2.5 rounded-xl hover:bg-[var(--bg-secondary)] text-amber-500 transition-colors"
              title="Saved Favorites & Highlights"
              aria-label="Saved Favorites & Highlights"
            >
              <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400" />
              {savedCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[var(--accent-color)] text-white text-[9px] font-bold flex items-center justify-center">
                  {savedCount > 9 ? '9+' : savedCount}
                </span>
              )}
            </button>
          )}

          <button
            onClick={onOpenSearch}
            className="p-2 sm:p-2.5 rounded-xl hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] transition-colors"
            title="Search Scripture"
            aria-label="Search"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            onClick={onOpenDailyVerse}
            className="p-2 sm:p-2.5 rounded-xl hover:bg-[var(--bg-secondary)] text-amber-600 dark:text-amber-400 transition-colors"
            title="Verse of the Day"
            aria-label="Verse of the Day"
          >
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            onClick={onToggleControls}
            className={`p-2 sm:p-2.5 rounded-xl transition-colors border ${
              showControls
                ? 'bg-[var(--accent-light)] border-[var(--accent-color)] text-[var(--accent-color)]'
                : 'hover:bg-[var(--bg-secondary)] border-transparent text-[var(--text-secondary)]'
            }`}
            title="Reader Display Settings"
            aria-label="Display settings"
          >
            <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
