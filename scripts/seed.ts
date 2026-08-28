import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import { SEED_TRANSLATIONS } from '../lib/seed-data/translations';
import { SEED_BOOKS } from '../lib/seed-data/books';
import { SEED_VERSES_RUTH } from '../lib/seed-data/verses-ruth';
import { SEED_VERSES_SAMPLES } from '../lib/seed-data/verses-samples';
import { SEED_DAILY_VERSES } from '../lib/seed-data/daily-verses';
import { getAmharicChapterVersesFromDisk } from '../lib/amharic-syncer';

async function runSeed() {
  const startedAt = new Date();
  console.log('====================================================');
  console.log('MULTILINGUAL BIBLE — DATABASE SEED & INGESTION');
  console.log('====================================================');

  const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/ruth_bible';
  console.log(`Connecting to Postgres at: ${connectionString.replace(/:[^:@]+@/, ':****@')}`);

  const pool = new Pool({ connectionString });
  const client = await pool.connect();

  try {
    // 1. Run schema.sql DDL
    const schemaPath = path.join(process.cwd(), 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      console.log('Applying schema.sql DDL...');
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await client.query(schemaSql);
      console.log('✓ Schema applied successfully.');
    }

    // 2. Ingest Translations
    console.log(`Seeding ${SEED_TRANSLATIONS.length} translations...`);
    for (const tr of SEED_TRANSLATIONS) {
      await client.query(
        `INSERT INTO translations (id, code, language, name, license_type, source_url, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (code) DO UPDATE 
         SET language = EXCLUDED.language, name = EXCLUDED.name, license_type = EXCLUDED.license_type, source_url = EXCLUDED.source_url, is_active = EXCLUDED.is_active`,
        [tr.id, tr.code, tr.language, tr.name, tr.license_type, tr.source_url, tr.is_active]
      );
    }
    console.log('✓ Translations seeded.');

    // 3. Ingest Books
    console.log(`Seeding ${SEED_BOOKS.length} canonical books...`);
    for (const b of SEED_BOOKS) {
      await client.query(
        `INSERT INTO books (id, testament, book_order, slug, name_en, name_am, name_he, name_gr, chapter_count)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (slug) DO UPDATE
         SET name_en = EXCLUDED.name_en, name_am = EXCLUDED.name_am, name_he = EXCLUDED.name_he, name_gr = EXCLUDED.name_gr, chapter_count = EXCLUDED.chapter_count`,
        [b.id, b.testament, b.book_order, b.slug, b.name_en, b.name_am, b.name_he, b.name_gr, b.chapter_count]
      );
    }
    console.log('✓ Books seeded.');

    // 4. Ingest Verses from am_new (All 66 Books!) and seed samples
    console.log('Ingesting all 66 books from am_new folder (Amharic 1879)...');
    const booksRes = await client.query('SELECT id, slug, book_order, chapter_count FROM books');
    const transRes = await client.query("SELECT id FROM translations WHERE code = 'am-1875'");
    const amTransId = transRes.rows[0]?.id || 1;

    let verseCount = 0;

    for (const bookRow of booksRes.rows) {
      for (let ch = 1; ch <= bookRow.chapter_count; ch++) {
        const amVerses = getAmharicChapterVersesFromDisk(bookRow.book_order, ch);
        for (const v of amVerses) {
          await client.query(
            `INSERT INTO verses (book_id, chapter, verse_num, translation_id, text)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (book_id, chapter, verse_num, translation_id) DO UPDATE
             SET text = EXCLUDED.text`,
            [bookRow.id, ch, v.verse_num, amTransId, v.text]
          );
          verseCount++;
        }
      }
    }
    console.log(`✓ Inserted ${verseCount} Amharic verses across all 66 books from am_new.`);

    // 5. Ingest English, Hebrew, and Greek Seed Samples & Ruth
    const otherVerses = [...SEED_VERSES_RUTH, ...SEED_VERSES_SAMPLES].filter(
      (v) => v.translation_code !== 'am-1875'
    );
    console.log(`Seeding ${otherVerses.length} other language verses (KJV, WEB, Hebrew, Greek)...`);

    const translationsRes = await client.query('SELECT id, code FROM translations');
    const transMap = new Map<string, number>(translationsRes.rows.map((r: any) => [r.code, r.id]));
    const bookMap = new Map<string, number>(booksRes.rows.map((r: any) => [r.slug, r.id]));

    for (const v of otherVerses) {
      const bookId = bookMap.get(v.book_slug);
      const transId = transMap.get(v.translation_code);
      if (bookId && transId) {
        await client.query(
          `INSERT INTO verses (book_id, chapter, verse_num, translation_id, text)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (book_id, chapter, verse_num, translation_id) DO UPDATE
           SET text = EXCLUDED.text`,
          [bookId, v.chapter, v.verse_num, transId, v.text]
        );
        verseCount++;
      }
    }

    // 6. Ingest Daily Verses
    console.log(`Seeding ${SEED_DAILY_VERSES.length} daily verses...`);
    for (const dv of SEED_DAILY_VERSES) {
      const bookId = bookMap.get(dv.book_slug);
      if (bookId) {
        await client.query(
          `INSERT INTO daily_verses (date, book_id, chapter, verse_num)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (date) DO UPDATE
           SET book_id = EXCLUDED.book_id, chapter = EXCLUDED.chapter, verse_num = EXCLUDED.verse_num`,
          [dv.date, bookId, dv.chapter, dv.verse_num]
        );
      }
    }
    console.log('✓ Daily verses seeded.');

    // 7. Ingestion Audit Log (NFR-P1-09)
    const completedAt = new Date();
    await client.query(
      `INSERT INTO ingestion_logs (source, started_at, completed_at, verse_count, status)
       VALUES ($1, $2, $3, $4, $5)`,
      ['seed_batch_pipeline_full_66_books', startedAt, completedAt, verseCount, 'success']
    );
    console.log('✓ Ingestion audit log recorded in ingestion_logs table.');

    console.log('====================================================');
    console.log('SEEDING COMPLETED SUCCESSFULLY!');
    console.log(`Total Verses Ingested: ${verseCount}`);
    console.log('====================================================');
  } catch (err: any) {
    console.error('Error during seeding:', err);
    try {
      await client.query(
        `INSERT INTO ingestion_logs (source, started_at, completed_at, verse_count, status, error_detail)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        ['seed_batch_pipeline_full_66_books', startedAt, new Date(), 0, 'failed', err.message]
      );
    } catch (logErr) {}
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runSeed();
