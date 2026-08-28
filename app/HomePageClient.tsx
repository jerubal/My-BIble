'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Book, Translation, DailyVerse } from '@/lib/types';
import { WelcomeCoverScreen } from '@/components/welcome/WelcomeCoverScreen';
import { BottomNavigation, MainTab } from '@/components/navigation/BottomNavigation';
import { StudyHub } from '@/components/study/StudyHub';
import { ReadingStatsDashboard } from '@/components/stats/ReadingStatsDashboard';
import { TranslationsCatalog } from '@/components/translations/TranslationsCatalog';
import { SavedVersesModal } from '@/components/reader/SavedVersesModal';
import { SearchModal } from '@/components/search/SearchModal';
import { DailyVerseModal } from '@/components/reader/DailyVerseModal';
import { TranslationInfoModal } from '@/components/reader/TranslationInfoModal';
import {
  Sparkles,
  Search,
  BookOpen,
  Flame,
  Star,
  Settings,
  ArrowRight,
  Languages,
  RotateCcw,
  Volume2,
  Image as ImageIcon,
} from 'lucide-react';

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
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<MainTab>('home');
  const [testamentFilter, setTestamentFilter] = useState<'all' | 'old' | 'new'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showTranslationsCatalog, setShowTranslationsCatalog] = useState<boolean>(false);

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDailyVerseOpen, setIsDailyVerseOpen] = useState(false);
  const [isAttributionOpen, setIsAttributionOpen] = useState(false);
  const [isSavedVersesOpen, setIsSavedVersesOpen] = useState(false);

  // User persistent state
  const [theme, setTheme] = useState<string>('dark');
  const [savedCount, setSavedCount] = useState<number>(0);
  const [notesCount, setNotesCount] = useState<number>(0);
  const [lastRead, setLastRead] = useState<{ bookSlug: string; bookNameEn: string; bookNameAm: string; chapter: number }>({
    bookSlug: 'ruth',
    bookNameEn: 'Ruth',
    bookNameAm: 'መጽሐፈ ሩት',
    chapter: 2,
  });

  const loadUserData = () => {
    try {
      const favs = JSON.parse(localStorage.getItem('ruth_favorites') || '{}');
      const hls = JSON.parse(localStorage.getItem('ruth_highlights') || '{}');
      const notes = JSON.parse(localStorage.getItem('ruth_notes') || '{}');
      setSavedCount(Object.keys(favs).length + Object.keys(hls).length);
      setNotesCount(Object.keys(notes).length);

      const savedBook = localStorage.getItem('ruth_last_book') || 'ruth';
      const savedChapter = parseInt(localStorage.getItem('ruth_last_chapter') || '2', 10);
      const matched = books.find((b) => b.slug === savedBook) || books.find((b) => b.slug === 'ruth') || books[0];
      if (matched) {
        setLastRead({
          bookSlug: matched.slug,
          bookNameEn: matched.name_en,
          bookNameAm: matched.name_am || matched.name_en,
          chapter: savedChapter,
        });
      }
    } catch (e) {}
  };

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('ruth_theme') || 'dark';
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);

      const savedTab = localStorage.getItem('ruth_home_tab') as MainTab;
      if (savedTab && ['home', 'read', 'study', 'stats', 'saved', 'cover'].includes(savedTab)) {
        setActiveTab(savedTab);
      }
    } catch (e) {}
    loadUserData();
  }, [books]);

  const handleTabChange = (tab: MainTab) => {
    setActiveTab(tab);
    try {
      localStorage.setItem('ruth_home_tab', tab);
    } catch (e) {}
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'black' : theme === 'black' ? 'sepia' : theme === 'sepia' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    try {
      localStorage.setItem('ruth_theme', nextTheme);
    } catch (e) {}
  };

  // 1. WELCOMING POSTER SCREEN (Full Viewport Non-Scrollable)
  if (activeTab === 'cover') {
    return (
      <div className="w-screen h-screen overflow-hidden bg-black select-none">
        <WelcomeCoverScreen
          onEnter={() => handleTabChange('home')}
          lastRead={{
            bookSlug: lastRead.bookSlug,
            bookName: lastRead.bookNameEn,
            chapter: lastRead.chapter,
          }}
        />
      </div>
    );
  }

  // Filtered books for Library tab
  const filteredBooks = books.filter((b) => {
    const matchesTestament =
      testamentFilter === 'all' || b.testament === testamentFilter;
    const matchesQuery =
      searchQuery === '' ||
      b.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.name_am && b.name_am.includes(searchQuery)) ||
      (b.slug && b.slug.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTestament && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] relative pb-28">
      {/* Top Header Chrome */}
      <header className="sticky top-0 z-30 bg-[var(--bg-primary)]/90 backdrop-blur-md border-b border-[var(--border-color)] px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-voice text-lg font-bold tracking-tight text-[var(--accent-color)]">
              መጽሐፍ ቅዱስ
            </span>
            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--accent-color)]/15 text-[var(--accent-color)] font-bold">
              66 Books
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Search Icon */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-8 h-8 rounded-full bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--accent-color)] transition-colors"
              title="Search Bible"
            >
              <Search className="w-3.5 h-3.5" />
            </button>

            {/* Poster Return */}
            <button
              onClick={() => handleTabChange('cover')}
              className="w-8 h-8 rounded-full bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--accent-color)] transition-colors"
              title="View Welcome Sacred Cover"
            >
              <ImageIcon className="w-3.5 h-3.5" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-full bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--accent-color)] transition-colors"
              title={`Theme: ${theme}`}
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-md mx-auto px-4 pt-4">
        {/* ================================================================= */}
        {/* TAB 1: HOME SCREEN (Matches Concept UI)                           */}
        {/* ================================================================= */}
        {activeTab === 'home' && (
          <div className="space-y-3.5 animate-fadeIn">
            {/* Topbar Greeting */}
            <div className="flex items-center justify-between pb-1">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent-color)]">
                  Scripture Reader
                </span>
                <h1 className="text-xl font-bold text-[var(--text-primary)]">Good day in the Word</h1>
              </div>
            </div>

            {/* 1. Verse of the Day Card (Glowing Card from Concept) */}
            <div className="verse-card">
              <div className="flex items-center justify-between mb-1.5">
                <div className="eyebrow flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Verse of the day</span>
                </div>
                <button
                  onClick={() => setIsDailyVerseOpen(true)}
                  className="text-[10px] px-2 py-0.5 rounded bg-[var(--bg-surface)] text-[var(--accent-color)] font-semibold border border-[var(--border-gold)]"
                >
                  Daily Prayer
                </button>
              </div>

              <p className="verse-text">
                "{dailyVerse ? dailyVerse.verse_text_en : 'For where thou goest, I will go; and where thou lodgest, I will lodge: thy people shall be my people, and thy God my God.'}"
              </p>

              <div className="flex items-center justify-between pt-1 border-t border-[var(--border-gold)]">
                <span className="verse-ref">
                  {dailyVerse ? `${dailyVerse.book_name} ${dailyVerse.chapter}:${dailyVerse.verse_num}` : 'Ruth 1:16'} · KJV
                </span>

                <button
                  onClick={() => router.push(`/read/${dailyVerse ? dailyVerse.book_slug : 'ruth'}/${dailyVerse ? dailyVerse.chapter : 1}?v=${dailyVerse ? dailyVerse.verse_num : 16}`)}
                  className="text-[11px] font-bold text-[var(--accent-color)] flex items-center gap-1 hover:underline"
                >
                  <span>Read Chapter</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* 2. Continue Reading Row Card */}
            <div
              onClick={() => router.push(`/read/${lastRead.bookSlug}/${lastRead.chapter}`)}
              className="row-card group"
            >
              <div>
                <div className="row-label">Continue reading</div>
                <div className="row-value font-amharic text-base">
                  {lastRead.bookNameAm} {lastRead.chapter}
                </div>
                <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                  {lastRead.bookNameEn} Chapter {lastRead.chapter}
                </div>
              </div>
              <span className="gold-dot group-hover:translate-x-1 transition-transform">→</span>
            </div>

            {/* 3. Reading Streak Row Card */}
            <div
              onClick={() => handleTabChange('stats')}
              className="row-card group"
            >
              <div>
                <div className="row-label">Reading streak</div>
                <div className="row-value">6 days active</div>
                <div className="text-[11px] text-[var(--text-muted)] mt-0.5">Keep your daily habit alive</div>
              </div>
              <span className="gold-dot text-lg">🔥</span>
            </div>

            {/* 4. Saved Verses & Highlights Card */}
            <div
              onClick={() => setIsSavedVersesOpen(true)}
              className="row-card group"
            >
              <div>
                <div className="row-label">Saved study items</div>
                <div className="row-value">
                  {savedCount} highlights & {notesCount} notes
                </div>
                <div className="text-[11px] text-[var(--text-muted)] mt-0.5">Tap to view bookmarks and export</div>
              </div>
              <span className="gold-dot group-hover:translate-x-1 transition-transform">→</span>
            </div>

            {/* 5. Quick Translation Switcher Banner */}
            <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent-color)] block">
                  Manuscripts & Versions
                </span>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">Public Domain & Open Catalog</h3>
              </div>
              <button
                onClick={() => {
                  setShowTranslationsCatalog(true);
                  handleTabChange('read');
                }}
                className="px-3 py-1.5 rounded-xl bg-[var(--accent-color)] text-[#241c08] text-xs font-bold shadow-sm"
              >
                Catalog
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: READ / LIBRARY SCREEN (Matches Concept UI)                 */}
        {/* ================================================================= */}
        {activeTab === 'read' && (
          <div className="space-y-4 animate-fadeIn">
            {showTranslationsCatalog ? (
              <div className="space-y-3">
                <button
                  onClick={() => setShowTranslationsCatalog(false)}
                  className="text-xs text-[var(--accent-color)] font-bold flex items-center gap-1 hover:underline"
                >
                  <span>← Back to 66 Books Library</span>
                </button>
                <TranslationsCatalog
                  translations={translations}
                  books={books}
                />
              </div>
            ) : (
              <>
                {/* Search Pill */}
                <div className="search-pill">
                  <Search className="w-4 h-4 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    placeholder="Search books or verses…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent text-xs w-full text-[var(--text-primary)] focus:outline-none"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="text-[var(--text-muted)] text-xs">
                      ✕
                    </button>
                  )}
                </div>

                {/* Testament Tabs */}
                <div className="testament-tabs">
                  <button
                    onClick={() => setTestamentFilter('all')}
                    className={`tab ${testamentFilter === 'all' ? 'active' : ''}`}
                  >
                    All (66)
                  </button>
                  <button
                    onClick={() => setTestamentFilter('old')}
                    className={`tab ${testamentFilter === 'old' ? 'active' : ''}`}
                  >
                    Old Testament (39)
                  </button>
                  <button
                    onClick={() => setTestamentFilter('new')}
                    className={`tab ${testamentFilter === 'new' ? 'active' : ''}`}
                  >
                    New Testament (27)
                  </button>
                </div>

                {/* Book Rows List (Matching Concept) */}
                <div className="space-y-1 divide-y divide-[var(--border-color)]">
                  {filteredBooks.map((b) => (
                    <div
                      key={b.slug}
                      onClick={() => router.push(`/read/${b.slug}/1`)}
                      className="book-row group"
                    >
                      <div>
                        <div className="book-name-en group-hover:text-[var(--accent-color)] transition-colors">
                          {b.name_en}
                        </div>
                        {b.name_am && (
                          <div className="book-name-am">{b.name_am}</div>
                        )}
                      </div>
                      <span className="book-chapters">{b.chapter_count} ch</span>
                    </div>
                  ))}
                </div>

                {/* Catalog Trigger Row */}
                <div
                  onClick={() => setShowTranslationsCatalog(true)}
                  className="row-card mt-4 group"
                >
                  <div className="flex items-center space-x-2.5">
                    <Languages className="w-4 h-4 text-[var(--accent-color)]" />
                    <div>
                      <div className="row-value text-xs">Translations Catalog</div>
                      <div className="text-[10px] text-[var(--text-muted)]">Amharic 1879, KJV, WEB, Hebrew, Greek</div>
                    </div>
                  </div>
                  <span className="gold-dot group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: STUDY HUB (Matches Concept UI)                             */}
        {/* ================================================================= */}
        {activeTab === 'study' && (
          <StudyHub onOpenSavedNotes={() => setIsSavedVersesOpen(true)} />
        )}

        {/* ================================================================= */}
        {/* TAB 4: STATS / READING ANALYTICS (Matches Concept UI)             */}
        {/* ================================================================= */}
        {activeTab === 'stats' && (
          <ReadingStatsDashboard />
        )}

        {/* ================================================================= */}
        {/* TAB 5: SAVED ITEMS / HIGHLIGHTS                                  */}
        {/* ================================================================= */}
        {activeTab === 'saved' && (
          <div className="space-y-4 animate-fadeIn pb-24">
            <div className="flex items-center justify-between py-2 border-b border-[var(--border-color)]">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent-color)] block">
                  Personal Study
                </span>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">Saved Verses & Notes</h2>
              </div>
              <button
                onClick={() => setIsSavedVersesOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-[var(--accent-color)] text-[#241c08] text-xs font-bold"
              >
                Open Full Viewer
              </button>
            </div>

            <div
              onClick={() => setIsSavedVersesOpen(true)}
              className="row-card group"
            >
              <div>
                <div className="row-label">Highlights (12 Colors)</div>
                <div className="row-value">{savedCount} Verses Highlighted</div>
              </div>
              <span className="gold-dot group-hover:translate-x-1 transition-transform">→</span>
            </div>

            <div
              onClick={() => setIsSavedVersesOpen(true)}
              className="row-card group"
            >
              <div>
                <div className="row-label">Personal Notes</div>
                <div className="row-value">{notesCount} Study Notes Saved</div>
              </div>
              <span className="gold-dot group-hover:translate-x-1 transition-transform">→</span>
            </div>

            <div
              onClick={() => setIsSavedVersesOpen(true)}
              className="row-card group"
            >
              <div>
                <div className="row-label">Backup & Export</div>
                <div className="row-value">JSON Export & Restore</div>
              </div>
              <span className="gold-dot group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>
        )}
      </main>

      {/* Docked Bottom Navigation Bar */}
      <BottomNavigation
        activeTab={activeTab}
        onChangeTab={handleTabChange}
      />

      {/* Shared Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        books={books}
      />

      <DailyVerseModal
        isOpen={isDailyVerseOpen}
        onClose={() => setIsDailyVerseOpen(false)}
        dailyVerse={dailyVerse}
      />

      <SavedVersesModal
        isOpen={isSavedVersesOpen}
        onClose={() => {
          setIsSavedVersesOpen(false);
          loadUserData();
        }}
      />

      <TranslationInfoModal
        isOpen={isAttributionOpen}
        onClose={() => setIsAttributionOpen(false)}
      />
    </div>
  );
}
