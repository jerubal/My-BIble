'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Translation, Book } from '@/lib/types';
import { Search, X, Loader2, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  translations?: Translation[];
  books?: Book[];
}

export function SearchModal({ isOpen, onClose, translations = [] }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedTranslation, setSelectedTranslation] = useState<string>('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const url = `/api/search?q=${encodeURIComponent(query)}${selectedTranslation ? `&translation=${selectedTranslation}` : ''}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.success) {
          setResults(data.data);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, selectedTranslation]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-4 sm:pt-16 p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[88vh] sm:max-h-[80vh] flex flex-col rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)]">
        {/* Search Input Bar */}
        <div className="p-3 sm:p-4 border-b border-[var(--border-color)] bg-[var(--bg-secondary)] flex items-center gap-2.5 sm:gap-3">
          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--text-muted)] shrink-0" />
          <input
            type="text"
            placeholder="Search scripture (e.g. 'famine', 'እግዚአብሔር', 'θεὸς')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 text-sm sm:text-base bg-transparent border-none focus:outline-none text-[var(--text-primary)] placeholder-[var(--text-muted)]"
          />
          {loading && <Loader2 className="w-4 h-4 animate-spin text-[var(--accent-color)]" />}
          <button
            onClick={onClose}
            className="p-1 sm:p-1.5 rounded-full hover:bg-[var(--border-color)] text-[var(--text-secondary)]"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Translation Filter Bar */}
        <div className="px-3 sm:px-4 py-2 bg-[var(--bg-primary)] border-b border-[var(--border-color)] flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar text-xs">
          <span className="font-semibold text-[var(--text-muted)] shrink-0">Filter:</span>
          <button
            onClick={() => setSelectedTranslation('')}
            className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              !selectedTranslation
                ? 'bg-[var(--accent-color)] text-white font-semibold'
                : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            All
          </button>
          {translations.map((t) => (
            <button
              key={t.code}
              onClick={() => setSelectedTranslation(t.code)}
              className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                selectedTranslation === t.code
                  ? 'bg-[var(--accent-color)] text-white font-semibold'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {t.short_code || t.code}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5 sm:space-y-3">
          {query.trim() && results.length === 0 && !loading && (
            <div className="text-center py-12 text-[var(--text-muted)] text-sm">
              No matching verses found for &quot;{query}&quot;.
            </div>
          )}

          {results.map((r, idx) => (
            <div
              key={idx}
              onClick={() => {
                onClose();
                router.push(`/read/${r.book_slug}/${r.chapter}?v=${r.verse_num}`);
              }}
              className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[var(--bg-primary)] hover:bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--accent-color)] transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="text-[var(--accent-color)]">
                  {r.name_en} {r.chapter}:{r.verse_num}
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[var(--bg-surface)] text-[var(--text-muted)]">
                  {r.language}
                </span>
              </div>
              <p
                className={`text-xs sm:text-sm text-[var(--text-primary)] ${
                  r.translation_code?.startsWith('heb')
                    ? 'script-hebrew text-right'
                    : r.translation_code?.startsWith('amh') || r.translation_code?.startsWith('am-')
                    ? 'script-amharic'
                    : ''
                }`}
              >
                {r.text}
              </p>
              <div className="mt-2 flex items-center justify-end text-xs text-[var(--accent-color)] opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Go to passage</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
