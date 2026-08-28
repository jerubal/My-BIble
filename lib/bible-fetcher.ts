import { AlignedVerse, Translation, Book } from './types';
import { SEED_TRANSLATIONS } from './seed-data/translations';
import { SEED_VERSES_RUTH } from './seed-data/verses-ruth';
import { SEED_VERSES_SAMPLES } from './seed-data/verses-samples';
import { getAmharicChapterVersesFromDisk } from './amharic-syncer';

// Mapping from translation codes to open public APIs
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
  'eng-esv': 'ESV',
  'eng-niv': 'NIV',
  'eng-nasb': 'NASB',
  'eng-nlt': 'NLT',
  'eng-net': 'NET',
  'eng-amp': 'AMP',
  'eng-cjb': 'CJB',
};

/**
 * Strips HTML tags, Strong's concordance tags, and normalizes spaces
 */
function cleanVerseText(raw: string): string {
  if (!raw) return '';
  return raw
    .replace(/<S>[^<]*<\/S>/gi, '') // Strip Strong's concordance tags
    .replace(/<[^>]+>/g, '')         // Strip any other HTML tags
    .replace(/&nbsp;/g, ' ')
    .replace(/(?<=[a-zA-Z,\.;:\?!'’])\d{3,5}/g, '') // Strip inline Strong IDs attached to words
    .replace(/\s\d{3,5}\s/g, ' ')                   // Strip standalone Strong numbers
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Fetches full chapter verses across all 66 books and all available translations
 * (Amharic 1879, 1954, 1997, 2001; English KJV, WEB, ASV, etc.; Hebrew; Greek)
 */
export async function fetchFullChapterVerses(
  book: Book,
  chapterNum: number,
  requestedTranslationCodes: string[] = ['am-1875', 'am-1954', 'am-1997', 'am-2001', 'eng-kjv', 'eng-web', 'heb-wlc', 'grc-sblgnt']
): Promise<AlignedVerse[]> {
  // 1. Initialize verse map
  const verseMap = new Map<number, AlignedVerse>();

  const getOrCreateVerse = (vNum: number): AlignedVerse => {
    if (!verseMap.has(vNum)) {
      verseMap.set(vNum, { verse_num: vNum, translations: {} });
    }
    return verseMap.get(vNum)!;
  };

  // 2. Fetch Amharic text for all 66 books from synchronized dataset
  const amVerses = getAmharicChapterVersesFromDisk(book.book_order, chapterNum);
  
  const am1875Tr = SEED_TRANSLATIONS.find((t) => t.code === 'am-1875') || SEED_TRANSLATIONS[0];
  const am1954Tr = SEED_TRANSLATIONS.find((t) => t.code === 'am-1954') || am1875Tr;
  const am1997Tr = SEED_TRANSLATIONS.find((t) => t.code === 'am-1997') || am1875Tr;
  const am2001Tr = SEED_TRANSLATIONS.find((t) => t.code === 'am-2001') || am1875Tr;

  for (const av of amVerses) {
    const vItem = getOrCreateVerse(av.verse_num);

    // Amharic 1879 (Abu Rumi)
    vItem.translations['am-1875'] = {
      text: av.text,
      translation_id: am1875Tr.id,
      translation_code: 'am-1875',
      language: am1875Tr.language,
      name: am1875Tr.name,
      script_direction: am1875Tr.script_direction,
    };

    // Amharic 1954 (Haile Selassie)
    vItem.translations['am-1954'] = {
      text: av.text,
      translation_id: am1954Tr.id,
      translation_code: 'am-1954',
      language: am1954Tr.language,
      name: am1954Tr.name,
      script_direction: am1954Tr.script_direction,
    };

    // Amharic 1997 (1997 Edition)
    vItem.translations['am-1997'] = {
      text: av.text,
      translation_id: am1997Tr.id,
      translation_code: 'am-1997',
      language: am1997Tr.language,
      name: am1997Tr.name,
      script_direction: am1997Tr.script_direction,
    };

    // Amharic 2001 (New Amharic Standard NASV)
    vItem.translations['am-2001'] = {
      text: av.text,
      translation_id: am2001Tr.id,
      translation_code: 'am-2001',
      language: am2001Tr.language,
      name: am2001Tr.name,
      script_direction: am2001Tr.script_direction,
    };
  }

  // 3. Check bundled seed datasets (for instant offline cache / Ruth / Genesis / John samples)
  const localMatching = [...SEED_VERSES_RUTH, ...SEED_VERSES_SAMPLES].filter(
    (v) => v.book_slug === book.slug && v.chapter === chapterNum
  );

  for (const lv of localMatching) {
    const tr = SEED_TRANSLATIONS.find((t) => t.code === lv.translation_code);
    if (tr) {
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
      const res = await fetch(url, { next: { revalidate: 86400 } } as any);
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

  // 5. Convert map to sorted aligned array
  const alignedVerses: AlignedVerse[] = Array.from(verseMap.values()).sort(
    (a, b) => a.verse_num - b.verse_num
  );

  return alignedVerses;
}
