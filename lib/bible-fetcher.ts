import { AlignedVerse, Translation, Book } from './types';
import { SEED_TRANSLATIONS } from './seed-data/translations';
import { SEED_VERSES_RUTH } from './seed-data/verses-ruth';
import { SEED_VERSES_SAMPLES } from './seed-data/verses-samples';
import { getAmharicChapterVersesFromDisk } from './amharic-syncer';

// Mapping from active public domain translation codes to open public APIs
const API_TRANSLATION_MAP: Record<string, string> = {
  'eng-kjv': 'KJV',
  'eng-web': 'WEB',
  'eng-asv': 'ASV',
  'eng-bbe': 'BBE',
  'eng-ylt': 'YLT',
  'eng-darby': 'DARBY',
  'eng-dra': 'DRA',
  'eng-gnv': 'GNV',
  'heb-wlc': 'WLC',
  'grc-sblgnt': 'LXX',
  'grc-tr': 'TR',
};

// In-memory cache for fully fetched chapter verses
const chapterCache = new Map<string, AlignedVerse[]>();

/**
 * Strips HTML tags, Strong's concordance tags, and normalizes spaces
 */
function cleanVerseText(raw: string): string {
  if (!raw) return '';
  return raw
    .replace(/<S>[^<]*<\/S>/gi, '') // Strip Strong's concordance tags
    .replace(/<[^>]+>/g, '')         // Strip any other HTML tags
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Fetches full chapter verses across all 66 books strictly adhering to licensing and data integrity.
 * Active Public Domain translations are populated. Inactive licensed translations return licensing notices.
 */
export async function fetchFullChapterVerses(
  book: Book,
  chapterNum: number,
  requestedTranslationCodes: string[] = ['am-1875', 'eng-kjv', 'eng-web', 'heb-wlc', 'grc-sblgnt']
): Promise<AlignedVerse[]> {
  const cacheKey = `${book.slug}-${chapterNum}`;

  // 1. Initialize verse map
  const verseMap = new Map<number, AlignedVerse>();

  const getOrCreateVerse = (vNum: number): AlignedVerse => {
    if (!verseMap.has(vNum)) {
      verseMap.set(vNum, { verse_num: vNum, translations: {} });
    }
    return verseMap.get(vNum)!;
  };

  // 2. Fetch Public Domain Amharic text (am-1875 Abu Rumi 1879) from verified local storage
  const amVerses = getAmharicChapterVersesFromDisk(book.book_order, chapterNum);
  const am1875Tr = SEED_TRANSLATIONS.find((t) => t.code === 'am-1875') || SEED_TRANSLATIONS[0];

  for (const av of amVerses) {
    const vItem = getOrCreateVerse(av.verse_num);

    // Only populate am-1875 (Authentic Public Domain Amharic)
    vItem.translations['am-1875'] = {
      text: av.text,
      translation_id: am1875Tr.id,
      translation_code: 'am-1875',
      language: am1875Tr.language,
      name: am1875Tr.name,
      script_direction: am1875Tr.script_direction,
    };
  }

  // 3. Check bundled seed datasets (for instant offline cache / Ruth / Genesis / John samples)
  const localMatching = [...SEED_VERSES_RUTH, ...SEED_VERSES_SAMPLES].filter(
    (v) => v.book_slug === book.slug && v.chapter === chapterNum
  );

  for (const lv of localMatching) {
    const tr = SEED_TRANSLATIONS.find((t) => t.code === lv.translation_code);
    if (tr && tr.is_active) {
      const vItem = getOrCreateVerse(lv.verse_num);
      vItem.translations[lv.translation_code] = {
        text: lv.text,
        translation_id: tr.id,
        translation_code: tr.code,
        language: tr.language,
        name: tr.name,
        script_direction: tr.script_direction,
      };
    }
  }

  // 4. Fetch missing translations from open public domain APIs for all 66 books
  const activeApiCodes = Object.keys(API_TRANSLATION_MAP);
  const apiTranslationsToFetch = activeApiCodes.filter((code) => {
    const tr = SEED_TRANSLATIONS.find((t) => t.code === code);
    return tr && tr.is_active;
  });

  const fetchPromises = apiTranslationsToFetch.map(async (code) => {
    const apiCode = API_TRANSLATION_MAP[code];
    if (!apiCode) return;

    // For NT books (book_order > 39), Hebrew WLC is OT only
    if (code === 'heb-wlc' && book.testament === 'new') {
      return;
    }

    try {
      const url = `https://bolls.life/get-chapter/${apiCode}/${book.book_order}/${chapterNum}/`;
      const res = await fetch(url, { next: { revalidate: 86400 } });
      if (!res.ok) return;

      const data: Array<{ verse: number; text: string }> = await res.json();
      if (!Array.isArray(data)) return;

      const tr = SEED_TRANSLATIONS.find((t) => t.code === code);
      if (!tr) return;

      for (const item of data) {
        const vNum = item.verse;
        const cleaned = cleanVerseText(item.text);

        const vItem = getOrCreateVerse(vNum);
        vItem.translations[code] = {
          text: cleaned,
          translation_id: tr.id,
          translation_code: tr.code,
          language: tr.language,
          name: tr.name,
          script_direction: tr.script_direction,
        };
      }
    } catch (err) {
      // Graceful error handling for offline/network issues
    }
  });

  await Promise.allSettled(fetchPromises);

  // 5. Data-Integrity & Licensing Compliance Verification
  for (const vItem of verseMap.values()) {
    // For any inactive licensed translation that might be requested in catalog or comparison:
    for (const tr of SEED_TRANSLATIONS) {
      if (!tr.is_active) {
        // Return clear notice rather than cloning another translation's text
        vItem.translations[tr.code] = {
          text: `[${tr.name}]: ይህ ትርጉም በቅጂ መብት ባለቤቱ የተጠበቀ በመሆኑ ከመሰራጨቱ በፊት የተረጋገጠ የጽሑፍ ፈቃድ (License Agreement) ያስፈልገዋል። [License agreement required from rights holder before distribution.]`,
          translation_id: tr.id,
          translation_code: tr.code,
          language: tr.language,
          name: tr.name,
          script_direction: tr.script_direction,
        };
      }
    }
  }

  // 6. Convert map to sorted aligned array
  const alignedVerses: AlignedVerse[] = Array.from(verseMap.values()).sort(
    (a, b) => a.verse_num - b.verse_num
  );

  return alignedVerses;
}
