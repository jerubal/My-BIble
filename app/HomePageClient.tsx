'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Book, Translation, DailyVerse } from '@/lib/types';
import { WelcomeCoverScreen } from '@/components/welcome/WelcomeCoverScreen';
import { QuickReaderDashboard } from '@/components/dashboard/QuickReaderDashboard';
import { BookGrid } from '@/components/navigation/BookGrid';
import { TranslationsCatalog } from '@/components/translations/TranslationsCatalog';
import { TranslationInfoModal } from '@/components/reader/TranslationInfoModal';
import { DailyVerseModal } from '@/components/reader/DailyVerseModal';
import { SearchModal } from '@/components/search/SearchModal';
import { SavedVersesModal } from '@/components/reader/SavedVersesModal';
import { BookOpen, Search, Sparkles, ShieldCheck, Sun, Moon, Library, Languages, Zap, Image as ImageIcon, Star } from 'lucide-react';

type DashboardTab = 'cover' | 'books' | 'translations' | 'quick-read';

interface HomePageClientProps {
  books: Book[];
  translations: Translation[];
  dailyVerse: DailyVerse | null;
}

export function HomePageClient({
  books,
  translations,
  dailyVerse,
}: HomePageClientProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>('cover');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDailyVerseOpen, setIsDailyVerseOpen] = useState(false);
  const [isAttributionOpen, setIsAttributionOpen] = useState(false);
  const [isSavedVersesOpen, setIsSavedVersesOpen] = useState(false);
  const [theme, setTheme] = useState<string>('sepia');
  const [savedCount, setSavedCount] = useState<number>(0);
  const [lastRead, setLastRead] = useState<{ bookSlug: string; bookName: string; chapter: number } | null>(null);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('ruth_theme') || 'sepia';
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);

      const savedTab = localStorage.getItem('ruth_home_tab') as DashboardTab;
      if (savedTab && ['cover', 'books', 'translations', 'quick-read'].includes(savedTab)) {
        setActiveTab(savedTab);
      }

      const favs = JSON.parse(localStorage.getItem('ruth_favorites') || '{}');
      const hls = JSON.parse(localStorage.getItem('ruth_highlights') || '{}');
      setSavedCount(Object.keys(favs).length + Object.keys(hls).length);

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

  const handleTabChange = (tab: DashboardTab) => {
    setActiveTab(tab);
    try {
      localStorage.setItem('ruth_home_tab', tab);
    } catch (e) {}
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'sepia' ? 'dark' : theme === 'dark' ? 'light' : 'sepia';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    try {
      localStorage.setItem('ruth_theme', nextTheme);
    } catch (e) {}
  };

  const refreshSavedCount = () => {
    try {
      const favs = JSON.parse(localStorage.getItem('ruth_favorites') || '{}');
      const hls = JSON.parse(localStorage.getItem('ruth_highlights') || '{}');
      setSavedCount(Object.keys(favs).length + Object.keys(hls).length);
    } catch (e) {}
  };

  // If on the Welcoming Cover screen: Render ONLY the full-screen non-scrollable poster with arrow
  if (activeTab === 'cover') {
    return (
      <div className="w-screen h-screen overflow-hidden bg-black select-none">
        <WelcomeCoverScreen
          onEnter={() => handleTabChange('books')}
          lastRead={lastRead}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] w-full overflow-x-hidden">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[var(--bg-surface)]/95 backdrop-blur-md border-b border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
          {/* Logo / Cover Launcher */}
          <button
            onClick={() => handleTabChange('cover')}
            className="flex items-center space-x-2 sm:space-x-3 group text-left min-w-0"
            title="Return to Welcome Cover"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[var(--accent-color)] text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform shrink-0">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm sm:text-base font-bold tracking-tight text-[var(--text-primary)] truncate">
                መጽሐፍ ቅዱስ <span className="text-[var(--accent-color)] font-serif font-normal text-xs sm:text-sm">Bible</span>
              </span>
              <span className="text-[9px] sm:text-[10px] text-[var(--text-muted)] font-medium truncate">
                Amharic • English • Hebrew • Greek
              </span>
            </div>
          </button>

          {/* Quick Actions */}
          <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
            {/* Return to Welcome Cover button */}
            <button
              onClick={() => handleTabChange('cover')}
              className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] text-xs font-semibold text-[var(--text-secondary)] transition-colors border border-[var(--border-color)]"
              title="View Welcome Poster"
            >
              <ImageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--accent-color)]" />
              <span className="hidden sm:inline">Poster</span>
            </button>

            {/* Saved Favorites & Highlights Modal Trigger */}
            <button
              onClick={() => setIsSavedVersesOpen(true)}
              className="relative p-1.5 sm:p-2 rounded-xl hover:bg-[var(--bg-secondary)] text-amber-500 transition-colors border border-transparent hover:border-[var(--border-color)]"
              title="Saved Favorites & Highlights"
              aria-label="Saved Favorites & Highlights"
            >
              <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400" />
              {savedCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-[var(--accent-color)] text-white text-[9px] font-bold flex items-center justify-center">
                  {savedCount > 9 ? '9+' : savedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] text-xs font-semibold text-[var(--text-secondary)] transition-colors border border-[var(--border-color)]"
              aria-label="Search"
            >
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--accent-color)]" />
              <span className="hidden md:inline">Search</span>
            </button>

            <button
              onClick={() => setIsDailyVerseOpen(true)}
              className="p-1.5 sm:p-2 rounded-xl hover:bg-[var(--bg-secondary)] text-amber-600 dark:text-amber-400 transition-colors border border-transparent hover:border-[var(--border-color)]"
              title="Daily Verse"
              aria-label="Daily Verse"
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              onClick={() => setIsAttributionOpen(true)}
              className="p-1.5 sm:p-2 rounded-xl hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] transition-colors border border-transparent hover:border-[var(--border-color)]"
              title="Translation Licensing"
              aria-label="Licensing"
            >
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" />
            </button>

            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-xl hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] transition-colors border border-transparent hover:border-[var(--border-color)]"
              title="Toggle Theme"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard Mode Switcher Bar */}
      <div className="bg-[var(--bg-surface)] border-b border-[var(--border-color)] shadow-sm sticky top-14 sm:top-16 z-30">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5">
          <nav className="flex items-center space-x-1.5 sm:space-x-2 overflow-x-auto no-scrollbar py-0.5">
            <button
              onClick={() => handleTabChange('books')}
              className={`flex items-center space-x-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'books'
                  ? 'bg-[var(--accent-color)] text-white shadow-sm'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-color)]'
              }`}
            >
              <Library className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>66 Books Library</span>
            </button>

            <button
              onClick={() => handleTabChange('translations')}
              className={`flex items-center space-x-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'translations'
                  ? 'bg-[var(--accent-color)] text-white shadow-sm'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-color)]'
              }`}
            >
              <Languages className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Translations ({translations.length})</span>
            </button>

            <button
              onClick={() => handleTabChange('quick-read')}
              className={`flex items-center space-x-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'quick-read'
                  ? 'bg-[var(--accent-color)] text-white shadow-sm'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-color)]'
              }`}
            >
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Direct Reader</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Single Non-Stacked Dashboard View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8">
        {activeTab === 'books' && (
          <div className="animate-fadeIn">
            <BookGrid books={books} />
          </div>
        )}

        {activeTab === 'translations' && (
          <div className="animate-fadeIn">
            <TranslationsCatalog
              translations={translations}
              books={books}
            />
          </div>
        )}

        {activeTab === 'quick-read' && (
          <div className="animate-fadeIn">
            <QuickReaderDashboard
              books={books}
              translations={translations}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border-color)] bg-[var(--bg-surface)] py-6 sm:py-8 px-4 text-center text-xs text-[var(--text-muted)] space-y-2">
        <p className="font-medium">
          Multilingual Bible Reader — Complete 66 Books in Amharic, English, Hebrew, and Greek.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          <button onClick={() => handleTabChange('cover')} className="hover:underline text-[var(--accent-color)] font-semibold">
            Welcome Poster
          </button>
          <span className="hidden sm:inline">•</span>
          <button onClick={() => setIsSavedVersesOpen(true)} className="hover:underline text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-400" /> Saved Verses
          </button>
          <span className="hidden sm:inline">•</span>
          <button onClick={() => handleTabChange('translations')} className="hover:underline text-[var(--accent-color)]">
            Translations
          </button>
          <span className="hidden sm:inline">•</span>
          <button onClick={() => setIsDailyVerseOpen(true)} className="hover:underline text-[var(--accent-color)]">
            Verse of the Day
          </button>
          <span className="hidden sm:inline">•</span>
          <button onClick={() => setIsAttributionOpen(true)} className="hover:underline text-[var(--accent-color)]">
            Licensing
          </button>
        </div>
      </footer>

      {/* Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        translations={translations}
      />

      <DailyVerseModal
        isOpen={isDailyVerseOpen}
        onClose={() => setIsDailyVerseOpen(false)}
        translations={translations}
      />

      <TranslationInfoModal
        isOpen={isAttributionOpen}
        onClose={() => setIsAttributionOpen(false)}
        translations={translations}
      />

      <SavedVersesModal
        isOpen={isSavedVersesOpen}
        onClose={() => setIsSavedVersesOpen(false)}
        onRefresh={refreshSavedCount}
      />
    </div>
  );
}
