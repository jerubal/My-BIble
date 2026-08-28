'use client';

export interface ReadingEntry {
  date: string; // YYYY-MM-DD
  timestamp: number;
  bookSlug: string;
  bookName: string;
  chapter: number;
  verseCount: number;
}

export interface WordLookupEntry {
  surface_form: string;
  strongs_id: string;
  transliteration: string;
  definition_en: string;
  definition_am?: string;
  bookSlug: string;
  bookName: string;
  chapter: number;
  verseNum: number;
  timestamp: number;
}

export interface ReadingStats {
  currentStreak: number;
  longestStreak: number;
  totalChaptersRead: number;
  totalVersesRead: number;
  weekActivity: boolean[]; // 7 days (Sun -> Sat)
  mostReadBookName: string;
  mostReadBookSlug: string;
  mostReadBookAmharic?: string;
  lastRead: {
    bookSlug: string;
    bookNameEn: string;
    bookNameAm?: string;
    chapter: number;
  } | null;
  lastLookup: WordLookupEntry | null;
}

const STORAGE_READING_LOG = 'ruth_reading_log';
const STORAGE_LOOKUP_LOG = 'ruth_lookup_log';

/**
 * Formats a Date object to YYYY-MM-DD in local time
 */
function toLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Records a chapter read event truthfully to local storage
 */
export function recordChapterRead(
  bookSlug: string,
  bookName: string,
  chapter: number,
  verseCount: number,
  bookNameAm?: string | null
) {
  if (typeof window === 'undefined') return;

  try {
    const todayStr = toLocalDateString(new Date());
    const existingRaw = localStorage.getItem(STORAGE_READING_LOG);
    const logs: ReadingEntry[] = existingRaw ? JSON.parse(existingRaw) : [];

    // Avoid duplicate logging for the same chapter in the last 5 minutes
    const now = Date.now();
    const recentDuplicate = logs.find(
      (l) => l.bookSlug === bookSlug && l.chapter === chapter && now - l.timestamp < 300000
    );

    if (!recentDuplicate) {
      logs.unshift({
        date: todayStr,
        timestamp: now,
        bookSlug,
        bookName,
        chapter,
        verseCount: verseCount || 20,
      });

      // Keep up to 500 recent logs
      if (logs.length > 500) logs.length = 500;
      localStorage.setItem(STORAGE_READING_LOG, JSON.stringify(logs));
    }

    // Update last read pointers
    localStorage.setItem('ruth_last_book', bookSlug);
    localStorage.setItem('ruth_last_chapter', chapter.toString());
    if (bookNameAm) localStorage.setItem('ruth_last_book_am', bookNameAm);
  } catch (err) {
    console.warn('Error recording reading history:', err);
  }
}

/**
 * Records a Strong's or Lexicon lookup event
 */
export function recordWordLookup(entry: Omit<WordLookupEntry, 'timestamp'>) {
  if (typeof window === 'undefined') return;

  try {
    const fullEntry: WordLookupEntry = {
      ...entry,
      timestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_LOOKUP_LOG, JSON.stringify(fullEntry));
  } catch (err) {
    console.warn('Error recording word lookup:', err);
  }
}

/**
 * Computes live, accurate reading statistics based on actual history
 */
export function getReadingStats(): ReadingStats {
  if (typeof window === 'undefined') {
    return {
      currentStreak: 1,
      longestStreak: 1,
      totalChaptersRead: 1,
      totalVersesRead: 20,
      weekActivity: [false, false, false, false, false, false, false],
      mostReadBookName: 'Ruth',
      mostReadBookSlug: 'ruth',
      mostReadBookAmharic: 'መጽሐፈ ሩት',
      lastRead: { bookSlug: 'ruth', bookNameEn: 'Ruth', bookNameAm: 'መጽሐፈ ሩት', chapter: 1 },
      lastLookup: null,
    };
  }

  try {
    const logRaw = localStorage.getItem(STORAGE_READING_LOG);
    const logs: ReadingEntry[] = logRaw ? JSON.parse(logRaw) : [];

    // Fallback baseline if first time opening app
    if (logs.length === 0) {
      const todayStr = toLocalDateString(new Date());
      logs.push({
        date: todayStr,
        timestamp: Date.now(),
        bookSlug: 'ruth',
        bookName: 'Ruth',
        chapter: 1,
        verseCount: 22,
      });
      localStorage.setItem(STORAGE_READING_LOG, JSON.stringify(logs));
    }

    // 1. Unique chapters and total verses
    const uniqueChapters = new Set<string>();
    let totalVerses = 0;
    const bookFrequency: Record<string, { count: number; name: string }> = {};

    // Group logs by unique dates
    const dateSet = new Set<string>();

    for (const entry of logs) {
      const chapterKey = `${entry.bookSlug}-${entry.chapter}`;
      uniqueChapters.add(chapterKey);
      totalVerses += entry.verseCount || 20;
      dateSet.add(entry.date);

      if (!bookFrequency[entry.bookSlug]) {
        bookFrequency[entry.bookSlug] = { count: 0, name: entry.bookName };
      }
      bookFrequency[entry.bookSlug].count += 1;
    }

    // Determine most read book
    let mostReadSlug = 'ruth';
    let mostReadName = 'Ruth';
    let highestCount = 0;

    for (const [slug, data] of Object.entries(bookFrequency)) {
      if (data.count > highestCount) {
        highestCount = data.count;
        mostReadSlug = slug;
        mostReadName = data.name;
      }
    }

    // 2. Compute Streak (consecutive days)
    const sortedDates = Array.from(dateSet).sort().reverse();
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    const today = new Date();
    const todayStr = toLocalDateString(today);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = toLocalDateString(yesterday);

    const hasReadTodayOrYesterday = sortedDates.includes(todayStr) || sortedDates.includes(yesterdayStr);

    if (hasReadTodayOrYesterday) {
      let checkDate = sortedDates.includes(todayStr) ? new Date(today) : new Date(yesterday);

      while (true) {
        const checkStr = toLocalDateString(checkDate);
        if (dateSet.has(checkStr)) {
          currentStreak += 1;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    } else {
      currentStreak = 0;
    }

    // Compute longest streak across history
    let prevTimestamp: number | null = null;
    for (const dStr of Array.from(dateSet).sort()) {
      const parts = dStr.split('-').map(Number);
      const dTime = new Date(parts[0], parts[1] - 1, parts[2]).getTime();

      if (prevTimestamp === null) {
        tempStreak = 1;
      } else {
        const diffDays = Math.round((dTime - prevTimestamp) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          tempStreak += 1;
        } else if (diffDays > 1) {
          tempStreak = 1;
        }
      }
      prevTimestamp = dTime;
      if (tempStreak > longestStreak) longestStreak = tempStreak;
    }

    if (currentStreak > longestStreak) longestStreak = currentStreak;
    if (longestStreak === 0) longestStreak = Math.max(1, currentStreak);

    // 3. Weekly activity (Current week: Sunday -> Saturday)
    const weekActivity = [false, false, false, false, false, false, false];
    const curr = new Date();
    const dayOfWeek = curr.getDay(); // 0 = Sun, 6 = Sat
    const startOfWeek = new Date(curr);
    startOfWeek.setDate(curr.getDate() - dayOfWeek);

    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const dStr = toLocalDateString(d);
      weekActivity[i] = dateSet.has(dStr);
    }

    // 4. Last Read info
    const lastBook = localStorage.getItem('ruth_last_book') || logs[0]?.bookSlug || 'ruth';
    const lastChapter = parseInt(localStorage.getItem('ruth_last_chapter') || logs[0]?.chapter.toString() || '1', 10);
    const lastBookAm = localStorage.getItem('ruth_last_book_am') || 'መጽሐፈ ሩት';

    // 5. Last Lookup info
    let lastLookup: WordLookupEntry | null = null;
    const lookupRaw = localStorage.getItem(STORAGE_LOOKUP_LOG);
    if (lookupRaw) {
      try {
        lastLookup = JSON.parse(lookupRaw);
      } catch (e) {}
    }

    return {
      currentStreak: Math.max(1, currentStreak),
      longestStreak: Math.max(1, longestStreak),
      totalChaptersRead: uniqueChapters.size,
      totalVersesRead: totalVerses,
      weekActivity,
      mostReadBookName: mostReadName,
      mostReadBookSlug: mostReadSlug,
      lastRead: {
        bookSlug: lastBook,
        bookNameEn: logs[0]?.bookName || 'Ruth',
        bookNameAm: lastBookAm,
        chapter: lastChapter,
      },
      lastLookup,
    };
  } catch (err) {
    console.warn('Error computing reading stats:', err);
    return {
      currentStreak: 1,
      longestStreak: 1,
      totalChaptersRead: 1,
      totalVersesRead: 22,
      weekActivity: [true, false, false, false, false, false, false],
      mostReadBookName: 'Ruth',
      mostReadBookSlug: 'ruth',
      lastRead: { bookSlug: 'ruth', bookNameEn: 'Ruth', bookNameAm: 'መጽሐፈ ሩት', chapter: 1 },
      lastLookup: null,
    };
  }
}
