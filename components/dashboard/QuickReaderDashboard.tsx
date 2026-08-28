'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Book, Translation } from '@/lib/types';
import { BookOpen, ArrowRight, Zap } from 'lucide-react';

interface QuickReaderDashboardProps {
  books: Book[];
  translations: Translation[];
}

export function QuickReaderDashboard({
  books,
  translations,
}: QuickReaderDashboardProps) {
  const router = useRouter();
  const [selectedBookSlug, setSelectedBookSlug] = useState<string>(books[0]?.slug || 'genesis');
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [selectedTranslation, setSelectedTranslation] = useState<string>('am-1875');

  const selectedBook = books.find((b) => b.slug === selectedBookSlug) || books[0];
  const totalChapters = selectedBook?.chapter_count || 50;

  const handleLaunch = () => {
    router.push(`/read/${selectedBookSlug}/${selectedChapter}?t=${selectedTranslation}`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8 animate-fadeIn w-full overflow-hidden">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[var(--accent-color)]/10 text-[var(--accent-color)] text-xs font-semibold">
          <Zap className="w-3.5 h-3.5" />
          <span>Direct Scripture Launcher</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
          Jump Straight to Any Passage
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
          Select any book of the Bible, choose your chapter, and pick your preferred translation.
        </p>
      </div>

      <div className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-xl space-y-4 sm:space-y-6">
        {/* Selector Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {/* 1. Book Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent-color)]">
              1. Book
            </label>
            <select
              value={selectedBookSlug}
              onChange={(e) => {
                setSelectedBookSlug(e.target.value);
                setSelectedChapter(1);
              }}
              className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] cursor-pointer"
            >
              <optgroup label="Old Testament • ብሉይ ኪዳን">
                {books
                  .filter((b) => b.testament === 'old')
                  .map((b) => (
                    <option key={b.slug} value={b.slug}>
                      {b.name_en} ({b.name_am || ''})
                    </option>
                  ))}
              </optgroup>
              <optgroup label="New Testament • ሐዲስ ኪዳን">
                {books
                  .filter((b) => b.testament === 'new')
                  .map((b) => (
                    <option key={b.slug} value={b.slug}>
                      {b.name_en} ({b.name_am || ''})
                    </option>
                  ))}
              </optgroup>
            </select>
          </div>

          {/* 2. Chapter Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent-color)]">
              2. Chapter (1 - {totalChapters})
            </label>
            <select
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(parseInt(e.target.value, 10))}
              className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] font-mono cursor-pointer"
            >
              {Array.from({ length: totalChapters }, (_, i) => i + 1).map((ch) => (
                <option key={ch} value={ch}>
                  Chapter {ch}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Translation Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent-color)]">
              3. Translation
            </label>
            <select
              value={selectedTranslation}
              onChange={(e) => setSelectedTranslation(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] cursor-pointer"
            >
              {translations.filter((t) => t.is_active).map((tr) => (
                <option key={tr.code} value={tr.code}>
                  [{tr.short_code || tr.code}] {tr.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Summary Card */}
        <div className="p-3.5 sm:p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[var(--accent-color)]/10 text-[var(--accent-color)] flex items-center justify-center font-bold shrink-0">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold text-[var(--text-primary)] truncate">
                {selectedBook?.name_en} {selectedChapter}
                {selectedBook?.name_am ? ` (${selectedBook.name_am})` : ''}
              </div>
              <div className="text-xs text-[var(--text-secondary)] truncate">
                {translations.find((t) => t.code === selectedTranslation)?.name}
              </div>
            </div>
          </div>

          <button
            onClick={handleLaunch}
            className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl sm:rounded-2xl bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white text-xs font-bold transition-transform active:scale-95 shadow-md shadow-[var(--accent-color)]/20 shrink-0"
          >
            <span>Open Reader</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
