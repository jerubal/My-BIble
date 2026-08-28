'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Book } from '@/lib/types';
import { Search, ChevronRight, BookOpen } from 'lucide-react';

interface BookGridProps {
  books: Book[];
}

export function BookGrid({ books }: BookGridProps) {
  const [testamentFilter, setTestamentFilter] = useState<'all' | 'old' | 'new'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      const matchesTestament =
        testamentFilter === 'all' || b.testament === testamentFilter;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesTestament;

      return (
        matchesTestament &&
        (b.name_en.toLowerCase().includes(q) ||
          b.slug.toLowerCase().includes(q) ||
          (b.name_am && b.name_am.includes(q)) ||
          (b.name_he && b.name_he.includes(q)) ||
          (b.name_gr && b.name_gr.toLowerCase().includes(q)))
      );
    });
  }, [books, testamentFilter, searchQuery]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn w-full overflow-hidden">
      {/* Header & Step 1 Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[var(--border-color)]">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-[var(--accent-light)] text-[var(--accent-color)] mb-2">
            <span>ደረጃ 1 • Step 1: Select Book</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            መጽሐፍ ይምረጡ • 66 Books
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Choose from the 66 canonical books to select chapters and start reading.
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search book / ፈልግ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] shadow-sm"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="inline-flex rounded-xl p-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs font-semibold shadow-inner overflow-x-auto no-scrollbar">
          <button
            onClick={() => setTestamentFilter('all')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all whitespace-nowrap ${
              testamentFilter === 'all'
                ? 'bg-[var(--accent-color)] text-white shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            All Books (66)
          </button>
          <button
            onClick={() => setTestamentFilter('old')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all whitespace-nowrap ${
              testamentFilter === 'old'
                ? 'bg-[var(--accent-color)] text-white shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            ብሉይ ኪዳን • OT (39)
          </button>
          <button
            onClick={() => setTestamentFilter('new')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all whitespace-nowrap ${
              testamentFilter === 'new'
                ? 'bg-[var(--accent-color)] text-white shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            ሐዲስ ኪዳን • NT (27)
          </button>
        </div>

        <span className="text-xs text-[var(--text-muted)] font-medium">
          Showing {filteredBooks.length} books
        </span>
      </div>

      {/* 66-Book Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {filteredBooks.map((book) => (
          <Link
            key={book.slug}
            href={`/read/${book.slug}`}
            className="group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-[var(--bg-surface)] hover:bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--accent-color)] transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
          >
            <div>
              {/* Top row: Order badge and Testament */}
              <div className="flex items-center justify-between text-xs font-semibold mb-2.5">
                <span className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[var(--bg-secondary)] group-hover:bg-[var(--accent-light)] text-[var(--text-secondary)] group-hover:text-[var(--accent-color)] font-mono text-xs">
                  {book.book_order}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[var(--bg-primary)] text-[var(--text-muted)] border border-[var(--border-color)]">
                  {book.testament === 'old' ? 'OT' : 'NT'}
                </span>
              </div>

              {/* Main English Name */}
              <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-color)] transition-colors">
                {book.name_en}
              </h3>

              {/* Localized Titles */}
              <div className="mt-1 space-y-0.5 text-xs text-[var(--text-secondary)]">
                {book.name_am && (
                  <p className="font-eth text-sm sm:text-base text-[var(--text-primary)]/90">
                    {book.name_am}
                  </p>
                )}
                <div className="flex items-center space-x-2 text-[10px] sm:text-[11px] text-[var(--text-muted)]">
                  {book.name_he && <span className="font-serif">{book.name_he}</span>}
                  {book.name_gr && <span className="italic">{book.name_gr}</span>}
                </div>
              </div>
            </div>

            {/* Bottom Row: Chapter count and Action Arrow */}
            <div className="mt-4 pt-3 border-t border-[var(--border-color)]/70 flex items-center justify-between text-xs">
              <span className="text-[var(--text-muted)] font-medium text-[11px] sm:text-xs">
                {book.chapter_count} {book.chapter_count === 1 ? 'Chapter' : 'Chapters'}
              </span>
              <div className="inline-flex items-center space-x-1 font-semibold text-[var(--accent-color)] opacity-80 group-hover:opacity-100 transition-opacity text-xs">
                <span>Select</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
