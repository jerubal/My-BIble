import { Pool } from 'pg';
import { Translation, Book, AlignedVerse, DailyVerse, IngestionLog } from './types';
import { SEED_TRANSLATIONS } from './seed-data/translations';
import { SEED_BOOKS } from './seed-data/books';
import { SEED_VERSES_RUTH } from './seed-data/verses-ruth';
import { SEED_VERSES_SAMPLES } from './seed-data/verses-samples';
import { SEED_DAILY_VERSES } from './seed-data/daily-verses';
import { fetchFullChapterVerses } from './bible-fetcher';

// Combined in-memory seed dataset for fallback and indexing
const ALL_SEED_VERSES = [...SEED_VERSES_RUTH, ...SEED_VERSES_SAMPLES];

// Multi-provider Postgres URL resolution (Vercel Postgres, Supabase, Neon, Railway, Render, local)
function getConnectionString(): string | null {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.SUPABASE_DB_URL ||
    process.env.NEON_DATABASE_URL ||
    null
  );
}

// Global connection pool cache for Next.js hot-reloads and serverless execution
declare global {
  // eslint-disable-next-line no-var
  var __ruthBiblePgPool: Pool | undefined;
}

export function getDbPool(): Pool | null {
  const connectionString = getConnectionString();
  if (!connectionString) {
    return null;
  }

  if (!globalThis.__ruthBiblePgPool) {
    const isCloud = !connectionString.includes('localhost') && !connectionString.includes('127.0.0.1');
    globalThis.__ruthBiblePgPool = new Pool({
      connectionString,
      ssl: isCloud ? { rejectUnauthorized: false } : undefined,
      max: process.env.NODE_ENV === 'production' ? 15 : 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

    globalThis.__ruthBiblePgPool.on('error', (err) => {
      console.error('[DB Pool Error]', err.message);
    });
  }

  return globalThis.__ruthBiblePgPool;
}

// -------------------------------------------------------------
// Translations Data Access
// -------------------------------------------------------------
export async function getTranslations(): Promise<Translation[]> {
  const db = getDbPool();
  if (db) {
    try {
      const res = await db.query(
        `SELECT id, code, language, name, license_type, source_url, is_active, created_at
         FROM translations WHERE is_active = true ORDER BY id ASC`
      );
      if (res.rows.length > 0) {
        return res.rows.map((r: any) => {
          const matchSeed = SEED_TRANSLATIONS.find((t) => t.code === r.code);
          return {
            ...matchSeed,
            ...r,
            script_direction: r.code.startsWith('heb') ? 'rtl' : 'ltr',
          };
        });
      }
    } catch (err) {
      console.warn('[DB] getTranslations falling back to seed data:', err);
    }
  }
  return SEED_TRANSLATIONS;
}

export async function getTranslationByCode(code: string): Promise<Translation | null> {
  const translations = await getTranslations();
  return translations.find((t) => t.code === code) || null;
}

// -------------------------------------------------------------
// Books Data Access (Using books.slug)
// -------------------------------------------------------------
export async function getBooks(): Promise<Book[]> {
  const db = getDbPool();
  if (db) {
    try {
      const res = await db.query(
        `SELECT id, testament, book_order, slug, name_en, name_am, name_he, name_gr, chapter_count
         FROM books ORDER BY book_order ASC`
      );
      if (res.rows.length > 0) {
        return res.rows;
      }
    } catch (err) {
      console.warn('[DB] getBooks falling back to seed data:', err);
    }
  }
  return SEED_BOOKS;
}

export async function getBookBySlug(slug: string): Promise<Book | null> {
  const db = getDbPool();
  if (db) {
    try {
      const res = await db.query(
        `SELECT id, testament, book_order, slug, name_en, name_am, name_he, name_gr, chapter_count
         FROM books WHERE slug = $1 LIMIT 1`,
        [slug.toLowerCase()]
      );
      if (res.rows.length > 0) {
        return res.rows[0];
      }
    } catch (err) {
      console.warn('[DB] getBookBySlug falling back to seed data:', err);
    }
  }
  return SEED_BOOKS.find((b) => b.slug.toLowerCase() === slug.toLowerCase()) || null;
}

// -------------------------------------------------------------
// Verses Data Access (Parallel Aligned by verse_num)
// -------------------------------------------------------------
export async function getChapterVerses(
  bookSlug: string,
  chapterNum: number,
  translationCodes: string[] = ['am-1875', 'eng-kjv', 'eng-web', 'heb-wlc', 'grc-sblgnt']
): Promise<AlignedVerse[]> {
  const db = getDbPool();
  const book = await getBookBySlug(bookSlug);
  if (!book) return [];

  if (db) {
    try {
      const query = `
        SELECT 
          v.verse_num,
          v.text,
          t.id AS translation_id,
          t.code AS translation_code,
          t.language,
          t.name AS translation_name
        FROM verses v
        JOIN translations t ON v.translation_id = t.id
        WHERE v.book_id = $1 
          AND v.chapter = $2 
          AND t.code = ANY($3)
        ORDER BY v.verse_num ASC, t.id ASC
      `;
      const res = await db.query(query, [book.id, chapterNum, translationCodes]);

      if (res.rows.length > 0) {
        const verseMap = new Map<number, AlignedVerse>();
        for (const row of res.rows) {
          if (!verseMap.has(row.verse_num)) {
            verseMap.set(row.verse_num, {
              verse_num: row.verse_num,
              translations: {},
            });
          }
          const item = verseMap.get(row.verse_num)!;
          item.translations[row.translation_code] = {
            text: row.text,
            translation_id: row.translation_id,
            translation_code: row.translation_code,
            language: row.language,
            name: row.translation_name,
            script_direction: row.translation_code.startsWith('heb') ? 'rtl' : 'ltr',
          };
        }
        return Array.from(verseMap.values()).sort((a, b) => a.verse_num - b.verse_num);
      }
    } catch (err) {
      console.warn('[DB] getChapterVerses DB query error, using dynamic fetcher:', err);
    }
  }

  // Use dynamic full chapter fetcher (pulls from am_new folder for Amharic + public APIs for English/Hebrew/Greek)
  return fetchFullChapterVerses(book, chapterNum, translationCodes);
}

// -------------------------------------------------------------
// Daily Verse Data Access (FR-P1-06)
// -------------------------------------------------------------
export async function getDailyVerse(dateStr: string): Promise<DailyVerse> {
  const seedMatch = SEED_DAILY_VERSES.find((d) => d.date === dateStr) || SEED_DAILY_VERSES[0];
  const targetBookSlug = seedMatch ? seedMatch.book_slug : 'ruth';
  const targetChapter = seedMatch ? seedMatch.chapter : 1;
  const targetVerseNum = seedMatch ? seedMatch.verse_num : 16;

  const bookObj = SEED_BOOKS.find((b) => b.slug === targetBookSlug) || SEED_BOOKS[7];

  const db = getDbPool();
  if (db) {
    try {
      const res = await db.query(
        `SELECT dv.date, dv.book_id, dv.chapter, dv.verse_num, b.slug, b.name_en, b.name_am, b.name_he, b.name_gr, b.testament, b.book_order, b.chapter_count
         FROM daily_verses dv
         JOIN books b ON dv.book_id = b.id
         WHERE dv.date = $1 LIMIT 1`,
        [dateStr]
      );
      if (res.rows.length > 0) {
        const row = res.rows[0];
        const versesRes = await db.query(
          `SELECT v.text, t.code
           FROM verses v
           JOIN translations t ON v.translation_id = t.id
           WHERE v.book_id = $1 AND v.chapter = $2 AND v.verse_num = $3`,
          [row.book_id, row.chapter, row.verse_num]
        );
        const versesObj: Record<string, string> = {};
        for (const vr of versesRes.rows) {
          versesObj[vr.code] = vr.text;
        }
        return {
          date: row.date,
          book_id: row.book_id,
          book_slug: row.slug,
          book_name: row.name_en,
          book_name_am: row.name_am,
          chapter: row.chapter,
          verse_num: row.verse_num,
          book: row,
          verses: versesObj,
          verse_text_en: versesObj['eng-kjv'] || versesObj['eng-web'] || 'For where thou goest, I will go; and where thou lodgest, I will lodge: thy people shall be my people, and thy God my God.',
          verse_text_am: versesObj['am-1875'] || versesObj['am-1954'] || 'ሩትም እንዲህ አለች፦ ወደምትሄጂበት እሄዳለሁ፥ በምታድሪበትም አድራለሁ፤ ሕዝብሽ ሕዝቤ፥ አምላክሽም አምላኬ ይሆናል።',
        };
      }
    } catch (err) {
      console.warn('[DB] getDailyVerse falling back to seed data:', err);
    }
  }

  // Fallback to deterministic seed
  const chapterVerses = await fetchFullChapterVerses(bookObj, targetChapter, ['am-1875', 'am-1954', 'eng-kjv', 'eng-web']);
  const verseMatch = chapterVerses.find((v) => v.verse_num === targetVerseNum);

  const versesObj: Record<string, string> = {};
  if (verseMatch) {
    for (const [code, val] of Object.entries(verseMatch.translations)) {
      versesObj[code] = val.text;
    }
  } else {
    versesObj['am-1875'] = 'ሩትም እንዲህ አለች፦ ወደምትሄጂበት እሄዳለሁ፥ በምታድሪበትም አድራለሁ፤ ሕዝብሽ ሕዝቤ፥ አምላክሽም አምላኬ ይሆናል።';
    versesObj['eng-kjv'] = 'For where thou goest, I will go; and where thou lodgest, I will lodge: thy people shall be my people, and thy God my God.';
  }

  return {
    date: dateStr,
    book_id: bookObj.id,
    book_slug: bookObj.slug,
    book_name: bookObj.name_en,
    book_name_am: bookObj.name_am || undefined,
    chapter: targetChapter,
    verse_num: targetVerseNum,
    book: bookObj,
    verses: versesObj,
    verse_text_en: versesObj['eng-kjv'] || versesObj['eng-web'] || 'For where thou goest, I will go; and where thou lodgest, I will lodge: thy people shall be my people, and thy God my God.',
    verse_text_am: versesObj['am-1875'] || versesObj['am-1954'] || 'ሩትም እንዲህ አለች፦ ወደምትሄጂበት እሄዳለሁ፥ በምታድሪበትም አድራለሁ፤ ሕዝብሽ ሕዝቤ፥ አምላክሽም አምላኬ ይሆናል።',
  };
}

// -------------------------------------------------------------
// Full-Text Search Data Access (FR-P1-05)
// -------------------------------------------------------------
export async function searchVerses(query: string, translationCode?: string, limit: number = 25) {
  const db = getDbPool();
  if (db && query.trim()) {
    try {
      const sql = `
        SELECT 
          v.id, v.chapter, v.verse_num, v.text,
          b.slug AS book_slug, b.name_en, b.name_am, b.name_he, b.name_gr,
          t.code AS translation_code, t.name AS translation_name, t.language
        FROM verses v
        JOIN books b ON v.book_id = b.id
        JOIN translations t ON v.translation_id = t.id
        WHERE v.text_search @@ plainto_tsquery('simple', $1)
          ${translationCode ? 'AND t.code = $2' : ''}
        LIMIT $${translationCode ? 3 : 2}
      `;
      const params = translationCode ? [query, translationCode, limit] : [query, limit];
      const res = await db.query(sql, params);
      return res.rows;
    } catch (err) {
      console.warn('[DB] searchVerses falling back to in-memory search:', err);
    }
  }

  // In-memory text matching fallback across loaded seed
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const results: any[] = [];
  for (const v of ALL_SEED_VERSES) {
    if (translationCode && v.translation_code !== translationCode) continue;
    if (v.text.toLowerCase().includes(q)) {
      const book = SEED_BOOKS.find((b) => b.slug === v.book_slug);
      const tr = SEED_TRANSLATIONS.find((t) => t.code === v.translation_code);
      results.push({
        chapter: v.chapter,
        verse_num: v.verse_num,
        text: v.text,
        book_slug: v.book_slug,
        name_en: book?.name_en || v.book_slug,
        name_am: book?.name_am,
        name_he: book?.name_he,
        name_gr: book?.name_gr,
        translation_code: v.translation_code,
        translation_name: tr?.name || v.translation_code,
        language: tr?.language || 'Unknown',
      });
      if (results.length >= limit) break;
    }
  }
  return results;
}

// -------------------------------------------------------------
// Push Subscriptions
// -------------------------------------------------------------
export async function savePushSubscription(
  endpoint: string,
  p256dh: string,
  auth: string,
  userId: string | null = null
) {
  const db = getDbPool();
  if (db) {
    await db.query(
      `INSERT INTO push_subscriptions (user_id, endpoint, p256dh, auth)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (endpoint) DO UPDATE 
       SET p256dh = EXCLUDED.p256dh, auth = EXCLUDED.auth, user_id = COALESCE(EXCLUDED.user_id, push_subscriptions.user_id)`,
      [userId, endpoint, p256dh, auth]
    );
  }
}

// -------------------------------------------------------------
// Ingestion Logging (NFR-P1-09)
// -------------------------------------------------------------
export async function logIngestionRun(log: IngestionLog) {
  const db = getDbPool();
  if (db) {
    try {
      await db.query(
        `INSERT INTO ingestion_logs (source, started_at, completed_at, verse_count, status, error_detail)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [log.source, log.started_at, log.completed_at || new Date().toISOString(), log.verse_count || 0, log.status, log.error_detail || null]
      );
    } catch (err) {
      console.warn('[DB] Failed to log ingestion to DB:', err);
    }
  }
}

// -------------------------------------------------------------
// User Bookmarks, Highlights & Notes Persistence (Postgres)
// -------------------------------------------------------------
export async function saveUserBookmark(userId: string, bookSlug: string, chapter: number, verseNum: number) {
  const db = getDbPool();
  if (!db) return;
  const book = await getBookBySlug(bookSlug);
  if (!book) return;

  await db.query(
    `INSERT INTO bookmarks (user_id, book_id, chapter, verse_num)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id, book_id, chapter, verse_num) DO NOTHING`,
    [userId, book.id, chapter, verseNum]
  );
}

export async function deleteUserBookmark(userId: string, bookSlug: string, chapter: number, verseNum: number) {
  const db = getDbPool();
  if (!db) return;
  const book = await getBookBySlug(bookSlug);
  if (!book) return;

  await db.query(
    `DELETE FROM bookmarks WHERE user_id = $1 AND book_id = $2 AND chapter = $3 AND verse_num = $4`,
    [userId, book.id, chapter, verseNum]
  );
}

export async function getUserBookmarks(userId: string) {
  const db = getDbPool();
  if (!db) return [];

  const res = await db.query(
    `SELECT b.slug AS book_slug, b.name_en, b.name_am, bm.chapter, bm.verse_num, bm.created_at
     FROM bookmarks bm
     JOIN books b ON bm.book_id = b.id
     WHERE bm.user_id = $1
     ORDER BY bm.created_at DESC`,
    [userId]
  );
  return res.rows;
}

export async function saveUserHighlight(
  userId: string,
  bookSlug: string,
  chapter: number,
  verseNum: number,
  color: string,
  note: string | null = null
) {
  const db = getDbPool();
  if (!db) return;
  const book = await getBookBySlug(bookSlug);
  if (!book) return;

  await db.query(
    `INSERT INTO highlights (user_id, book_id, chapter, verse_num, color, note, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, now())
     ON CONFLICT (user_id, book_id, chapter, verse_num) DO UPDATE
     SET color = EXCLUDED.color, note = EXCLUDED.note, updated_at = now()`,
    [userId, book.id, chapter, verseNum, color, note]
  );
}

export async function getUserHighlights(userId: string) {
  const db = getDbPool();
  if (!db) return [];

  const res = await db.query(
    `SELECT b.slug AS book_slug, b.name_en, b.name_am, h.chapter, h.verse_num, h.color, h.note, h.updated_at
     FROM highlights h
     JOIN books b ON h.book_id = b.id
     WHERE h.user_id = $1
     ORDER BY h.updated_at DESC`,
    [userId]
  );
  return res.rows;
}

export async function saveUserReadingProgress(userId: string, bookSlug: string, chapter: number) {
  const db = getDbPool();
  if (!db) return;
  const book = await getBookBySlug(bookSlug);
  if (!book) return;

  await db.query(
    `INSERT INTO reading_progress (user_id, book_id, chapter, last_read_at)
     VALUES ($1, $2, $3, now())
     ON CONFLICT (user_id, book_id) DO UPDATE
     SET chapter = EXCLUDED.chapter, last_read_at = now()`,
    [userId, book.id, chapter]
  );
}

export async function getUserReadingProgress(userId: string) {
  const db = getDbPool();
  if (!db) return [];

  const res = await db.query(
    `SELECT b.slug AS book_slug, b.name_en, b.name_am, b.chapter_count, rp.chapter, rp.last_read_at
     FROM reading_progress rp
     JOIN books b ON rp.book_id = b.id
     WHERE rp.user_id = $1
     ORDER BY rp.last_read_at DESC`,
    [userId]
  );
  return res.rows;
}


