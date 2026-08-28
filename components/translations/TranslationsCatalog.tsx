'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Translation, Book } from '@/lib/types';
import { BookOpen, Sparkles, Search } from 'lucide-react';

interface TranslationsCatalogProps {
  translations: Translation[];
  books: Book[];
  onSelectTranslation?: (code: string) => void;
}

export function TranslationsCatalog({
  translations,
  books,
  onSelectTranslation,
}: TranslationsCatalogProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedLicense, setSelectedLicense] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const languages = ['all', 'Amharic', 'English', 'Hebrew', 'Greek'];

  const filteredTranslations = translations.filter((t) => {
    const matchesLang = selectedLanguage === 'all' || t.language.toLowerCase() === selectedLanguage.toLowerCase();
    const matchesLicense =
      selectedLicense === 'all' ||
      (selectedLicense === 'public_domain' && t.license_type === 'public_domain') ||
      (selectedLicense === 'licensed' && t.license_type === 'licensed') ||
      (selectedLicense === 'creative_commons' && t.license_type === 'creative_commons');
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.short_code && t.short_code.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesLang && matchesLicense && matchesSearch;
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn w-full overflow-hidden">
      {/* Header & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 sm:pb-6 border-b border-[var(--border-color)]">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[var(--accent-color)]/10 text-[var(--accent-color)] text-[10px] sm:text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Complete Multilingual Catalog</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            Translations & Biblical Texts
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 max-w-2xl">
            Explore authentic historical manuscripts, modern analytical versions, and public domain translations across Amharic, English, Hebrew, and Greek.
          </p>
        </div>

        {/* Quick Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search translation or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Language Filter */}
        <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] overflow-x-auto no-scrollbar">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedLanguage === lang
                  ? 'bg-[var(--accent-color)] text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
              }`}
            >
              {lang === 'all' ? 'All Languages' : lang}
            </button>
          ))}
        </div>

        {/* License Filter */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-[var(--text-muted)] hidden sm:inline">License:</span>
          <select
            value={selectedLicense}
            onChange={(e) => setSelectedLicense(e.target.value)}
            className="w-full sm:w-auto px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] text-xs focus:outline-none"
          >
            <option value="all">All Licenses</option>
            <option value="public_domain">Public Domain (Open Full Text)</option>
            <option value="licensed">Licensed / Reference</option>
            <option value="creative_commons">Creative Commons</option>
          </select>
        </div>
      </div>

      {/* Grid of Translations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredTranslations.map((tr) => {
          const isPublicDomain = tr.license_type === 'public_domain';
          const defaultBook = books[0]?.slug || 'genesis';

          return (
            <div
              key={tr.code}
              className="flex flex-col justify-between rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] p-4 sm:p-5 hover:border-[var(--accent-color)]/60 hover:shadow-md transition-all group"
            >
              <div className="space-y-2.5 sm:space-y-3">
                {/* Badges row */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold font-mono bg-[var(--accent-color)]/15 text-[var(--accent-color)]">
                      {tr.short_code || tr.code}
                    </span>
                    <span className="text-xs font-semibold text-[var(--text-secondary)]">
                      {tr.language}
                    </span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      isPublicDomain
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                    }`}
                  >
                    {isPublicDomain ? 'Public Domain' : 'Licensed'}
                  </span>
                </div>

                {/* Translation Name */}
                <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-color)] transition-colors leading-snug">
                  {tr.name}
                </h3>

                {/* Description */}
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-3">
                  {tr.description || 'Full biblical text and cross-references available in this translation.'}
                </p>

                {/* Features Tags */}
                {tr.features && tr.features.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {tr.features.map((feat) => (
                      <span
                        key={feat}
                        className="px-2 py-0.5 rounded-md bg-[var(--bg-secondary)] text-[10px] text-[var(--text-muted)] font-medium"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-[var(--border-color)] flex items-center justify-between">
                <span className="text-[10px] sm:text-[11px] text-[var(--text-muted)] font-medium">
                  {tr.year ? `Year: ${tr.year}` : 'Manuscript'}
                </span>

                <Link
                  href={`/read/${defaultBook}/1?t=${tr.code}`}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold transition-transform active:scale-95 shadow-sm"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Read</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTranslations.length === 0 && (
        <div className="text-center py-12 bg-[var(--bg-surface)] rounded-2xl border border-dashed border-[var(--border-color)]">
          <BookOpen className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2 opacity-40" />
          <h4 className="text-sm font-semibold text-[var(--text-primary)]">No translations match your filters</h4>
          <p className="text-xs text-[var(--text-muted)] mt-1">Try resetting the language or license filter.</p>
        </div>
      )}
    </div>
  );
}
