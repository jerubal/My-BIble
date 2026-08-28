export interface SeedDailyVerse {
  date: string; // YYYY-MM-DD
  book_slug: string;
  chapter: number;
  verse_num: number;
}

export const SEED_DAILY_VERSES: SeedDailyVerse[] = [
  { date: '2026-08-27', book_slug: 'ruth', chapter: 1, verse_num: 16 },
  { date: '2026-08-28', book_slug: 'ruth', chapter: 2, verse_num: 12 },
  { date: '2026-08-29', book_slug: 'john', chapter: 1, verse_num: 1 },
  { date: '2026-08-30', book_slug: 'genesis', chapter: 1, verse_num: 3 },
  { date: '2026-08-31', book_slug: 'ruth', chapter: 4, verse_num: 14 },
];
