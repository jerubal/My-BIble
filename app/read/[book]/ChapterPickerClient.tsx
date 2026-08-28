'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Book } from '@/lib/types';
import { ArrowLeft, BookOpen } from 'lucide-react';

interface ChapterPickerClientProps {
  book: Book;
  allBooks: Book[];
}

export function ChapterPickerClient({
  book,
  allBooks,
}: ChapterPickerClientProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] w-full overflow-x-hidden">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-[var(--bg-surface)]/95 backdrop-blur-md border-b border-[var(--border-color)]">
        <div className="max-w-5xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-semibold text-[var(--accent-color)] hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Books • ሁሉም መጻሕፍት</span>
          </Link>

          <span className="text-[10px] sm:text-xs font-mono px-2 sm:px-2.5 py-1 rounded-full bg-[var(--bg-secondary)] text-[var(--text-muted)] border border-[var(--border-color)]">
            Book {book.book_order} of 66
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">
        {/* Step 2 Indicator & Book Title Banner */}
        <div className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-3 sm:space-y-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
            <span className="inline-flex items-center self-center sm:self-start px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-[var(--accent-light)] text-[var(--accent-color)]">
              ደረጃ 2 • Step 2: Select Chapter
            </span>
            <span className="text-[10px] sm:text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold">
              {book.testament === 'old' ? 'ብሉይ ኪዳን • Old Testament' : 'ሐዲስ ኪዳን • New Testament'}
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--text-primary)]">
              {book.name_en}
            </h1>
            <div className="mt-1.5 sm:mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4 text-sm sm:text-lg text-[var(--text-secondary)]">
              {book.name_am && (
                <span className="font-eth text-lg sm:text-xl text-[var(--accent-color)] font-semibold">
                  {book.name_am}
                </span>
              )}
              {book.name_he && (
                <span className="font-serif text-sm sm:text-lg font-medium text-[var(--text-muted)]">
                  {book.name_he}
                </span>
              )}
              {book.name_gr && (
                <span className="italic text-xs sm:text-base text-[var(--text-muted)]">
                  {book.name_gr}
                </span>
              )}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[var(--text-muted)] pt-2 border-t border-[var(--border-color)]/60">
            This book contains {book.chapter_count} {book.chapter_count === 1 ? 'chapter' : 'chapters'}. Choose a chapter below to open the reading view.
          </p>
        </div>

        {/* Chapter Grid */}
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-[var(--text-primary)] flex items-center space-x-2">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--accent-color)]" />
            <span>ምዕራፎች • Chapters ({book.chapter_count})</span>
          </h2>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 sm:gap-3">
            {Array.from({ length: book.chapter_count }, (_, i) => i + 1).map((chNum) => (
              <button
                key={chNum}
                onClick={() => router.push(`/read/${book.slug}/${chNum}`)}
                className="group relative aspect-square flex flex-col items-center justify-center rounded-xl sm:rounded-2xl bg-[var(--bg-surface)] hover:bg-[var(--accent-color)] border border-[var(--border-color)] hover:border-transparent text-[var(--text-primary)] hover:text-white transition-all duration-200 shadow-sm hover:shadow-lg active:scale-95"
              >
                <span className="text-lg sm:text-2xl font-bold font-mono tracking-tight">
                  {chNum}
                </span>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
