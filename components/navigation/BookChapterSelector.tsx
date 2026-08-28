'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Book } from '@/lib/types';
import { Search, X, BookOpen, ChevronRight, ArrowLeft } from 'lucide-react';

interface BookChapterSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  books: Book[];
  currentBook: Book;
  currentChapter: number;
}

export function BookChapterSelector({
  isOpen,
  onClose,
  books,
  currentBook,
  currentChapter,
}: BookChapterSelectorProps) {
  const router = useRouter();
  const [selectedBook, setSelectedBook] = useState<Book>(currentBook);
  const [testamentFilter, setTestamentFilter] = useState<'all' | 'old' | 'new'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileStep, setMobileStep] = useState<'books' | 'chapters'>('chapters');

  // Filter books by testament and search query
  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      const matchesTestament =
        testamentFilter === 'all' || b.testament === testamentFilter;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesTestament;

      const matchesQuery =
        b.name_en.toLowerCase().includes(q) ||
        b.slug.toLowerCase().includes(q) ||
        (b.name_am && b.name_am.includes(q)) ||
        (b.name_he && b.name_he.includes(q)) ||
        (b.name_gr && b.name_gr.toLowerCase().includes(q));

      return matchesTestament && matchesQuery;
    });
  }, [books, testamentFilter, searchQuery]);

  const handleSelectBook = (b: Book) => {
    setSelectedBook(b);
    setMobileStep('chapters');
  };

  const handleSelectChapter = (bookSlug: string, chapter: number) => {
    onClose();
    router.push(`/read/${bookSlug}/${chapter}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] sm:max-h-[85vh] flex flex-col rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            {mobileStep === 'chapters' && (
              <button
                onClick={() => setMobileStep('books')}
                className="md:hidden p-1.5 rounded-lg hover:bg-[var(--border-color)] text-[var(--accent-color)]"
                aria-label="Back to books"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <BookOpen className="w-5 h-5 text-[var(--accent-color)]" />
            <h2 className="text-base sm:text-lg font-bold tracking-tight">
              {mobileStep === 'books' ? 'Select Book' : `${selectedBook.name_en} — Select Chapter`}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-full hover:bg-[var(--border-color)] transition-colors text-[var(--text-secondary)]"
            aria-label="Close selector"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls (Shown in Books view) */}
        <div className={`p-3 sm:p-4 border-b border-[var(--border-color)] bg-[var(--bg-primary)] space-y-2.5 ${mobileStep === 'chapters' ? 'hidden md:block' : 'block'}`}>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
            {/* Testament Toggle Pills */}
            <div className="inline-flex rounded-lg p-0.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs font-medium overflow-x-auto no-scrollbar">
              <button
                onClick={() => setTestamentFilter('all')}
                className={`px-3 py-1 rounded-md transition-colors whitespace-nowrap ${
                  testamentFilter === 'all'
                    ? 'bg-[var(--accent-color)] text-white'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                All (66)
              </button>
              <button
                onClick={() => setTestamentFilter('old')}
                className={`px-3 py-1 rounded-md transition-colors whitespace-nowrap ${
                  testamentFilter === 'old'
                    ? 'bg-[var(--accent-color)] text-white'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                OT (39)
              </button>
              <button
                onClick={() => setTestamentFilter('new')}
                className={`px-3 py-1 rounded-md transition-colors whitespace-nowrap ${
                  testamentFilter === 'new'
                    ? 'bg-[var(--accent-color)] text-white'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                NT (27)
              </button>
            </div>

            {/* Book search filter */}
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Filter book list..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)]"
              />
            </div>
          </div>
        </div>

        {/* Body: Split View (Responsive Mobile step switcher + Desktop dual columns) */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden min-h-[300px] sm:min-h-[380px]">
          {/* Books Column */}
          <div className={`md:col-span-6 border-r border-[var(--border-color)] overflow-y-auto max-h-[60vh] md:max-h-full p-2 space-y-1 ${mobileStep === 'chapters' ? 'hidden md:block' : 'block'}`}>
            <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Choose Book ({filteredBooks.length})
            </div>
            {filteredBooks.map((b) => {
              const isSelected = selectedBook.slug === b.slug;
              return (
                <button
                  key={b.slug}
                  onClick={() => handleSelectBook(b)}
                  className={`w-full text-left px-3 py-2 sm:py-2.5 rounded-xl transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-[var(--accent-light)] border border-[var(--accent-color)] text-[var(--accent-color)] font-semibold shadow-sm'
                      : 'hover:bg-[var(--bg-secondary)] text-[var(--text-primary)]'
                  }`}
                >
                  <div className="flex flex-col min-w-0 pr-2">
                    <span className="text-sm font-medium truncate">{b.name_en}</span>
                    <span className="text-xs text-[var(--text-muted)] font-normal truncate flex items-center gap-2">
                      {b.name_am && <span className="font-eth">{b.name_am}</span>}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 shrink-0">
                    <span className="text-[11px] text-[var(--text-muted)]">{b.chapter_count} ch</span>
                    <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-[var(--accent-color)]' : 'text-[var(--text-muted)]'}`} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Chapters Column */}
          <div className={`md:col-span-6 p-4 overflow-y-auto max-h-[60vh] md:max-h-full bg-[var(--bg-primary)] ${mobileStep === 'books' ? 'hidden md:block' : 'block'}`}>
            <div className="mb-3 pb-2 border-b border-[var(--border-color)] flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">{selectedBook.name_en}</h3>
                <p className="text-xs text-[var(--text-muted)]">
                  {selectedBook.name_am} • {selectedBook.chapter_count} Chapters
                </p>
              </div>
              <button
                onClick={() => setMobileStep('books')}
                className="md:hidden text-xs font-semibold text-[var(--accent-color)] px-2.5 py-1 rounded-lg bg-[var(--bg-secondary)]"
              >
                Change Book
              </button>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-2.5">
              {Array.from({ length: selectedBook.chapter_count }, (_, i) => i + 1).map((chNum) => {
                const isCurrent =
                  currentBook.slug === selectedBook.slug && currentChapter === chNum;
                return (
                  <button
                    key={chNum}
                    onClick={() => handleSelectChapter(selectedBook.slug, chNum)}
                    className={`aspect-square flex items-center justify-center rounded-xl text-sm font-semibold transition-transform active:scale-95 ${
                      isCurrent
                        ? 'bg-[var(--accent-color)] text-white shadow-md ring-2 ring-offset-1 ring-[var(--accent-color)]'
                        : 'bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] text-[var(--text-primary)] shadow-sm'
                    }`}
                  >
                    {chNum}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
