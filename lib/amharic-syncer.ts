import fs from 'fs';
import path from 'path';
import { Book, TranslationVerse } from './types';

// In-memory cache for parsed Amharic chapters to ensure instant delivery
const amharicChapterCache = new Map<string, TranslationVerse[]>();

/**
 * Extracts and cleans verse text from an HTML snippet in am_new
 */
function cleanAmharicText(raw: string): string {
  if (!raw) return '';
  return raw
    .replace(/<[^>]+>/g, '') // remove HTML tags
    .replace(/&nbsp;/g, ' ')
    .replace(/^[፤፦\s\d]+/, '') // remove leading punctuation or stray numbers
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Parses an Amharic HTML file from the am_new folder for a given book order and chapter
 * e.g., am_new/01/1.htm for Genesis 1, am_new/19/119.htm for Psalm 119
 */
export function getAmharicChapterVersesFromDisk(
  bookOrder: number,
  chapterNum: number
): TranslationVerse[] {
  const cacheKey = `${bookOrder}-${chapterNum}`;
  if (amharicChapterCache.has(cacheKey)) {
    return amharicChapterCache.get(cacheKey)!;
  }

  const paddedBook = bookOrder.toString().padStart(2, '0');
  const possiblePaths = [
    path.join(process.cwd(), 'am_new', paddedBook, `${chapterNum}.htm`),
    path.join(process.cwd(), 'am_new', paddedBook, `${chapterNum}.html`),
    path.join(__dirname, '..', 'am_new', paddedBook, `${chapterNum}.htm`),
    path.join(__dirname, '..', '..', 'am_new', paddedBook, `${chapterNum}.htm`),
  ];

  let filePath = '';
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      filePath = p;
      break;
    }
  }

  if (!filePath) {
    return [];
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const textBodyMatch = content.match(/<div class="textBody" id="textBody">([\s\S]*?)<\/div>/i);
    if (!textBodyMatch) return [];

    const body = textBodyMatch[1];
    const verses: TranslationVerse[] = [];

    // Regex to find verse marker spans: <span class="verse" id="(\d+)"> or <span class='verse' id='(\d+)'>
    const verseRegex = /<span\s+class=["']verse["']\s+id=["'](\d+)["']>\s*\d*\s*<\/span>/gi;
    const markers: Array<{ verseNum: number; index: number; length: number }> = [];

    let match: RegExpExecArray | null;
    while ((match = verseRegex.exec(body)) !== null) {
      markers.push({
        verseNum: parseInt(match[1], 10),
        index: match.index,
        length: match[0].length,
      });
    }

    if (markers.length === 0) {
      // Fallback: parse entire body text as single chapter/verse
      const clean = cleanAmharicText(body);
      if (clean) {
        verses.push({
          verse_num: 1,
          text: clean,
          translation_code: 'am-1875',
          book_slug: '',
          chapter: chapterNum,
        });
      }
      amharicChapterCache.set(cacheKey, verses);
      return verses;
    }

    // Check if there is Verse 1 content preceding the first explicit marker
    // In WordProject format, verse 1 starts right after <p><!--span class="verse" id="1">1</span-->
    const beforeFirst = body.substring(0, markers[0].index);
    const v1Clean = cleanAmharicText(beforeFirst.replace(/<h3>[\s\S]*?<\/h3>/i, ''));
    if (v1Clean && (!markers[0] || markers[0].verseNum > 1)) {
      verses.push({
        verse_num: 1,
        text: v1Clean,
        translation_code: 'am-1875',
        book_slug: '',
        chapter: chapterNum,
      });
    }

    // Process all marked verses
    for (let i = 0; i < markers.length; i++) {
      const current = markers[i];
      const next = markers[i + 1];
      const start = current.index + current.length;
      const end = next ? next.index : body.indexOf('</p>', start);
      const rawChunk = end !== -1 ? body.substring(start, end) : body.substring(start);
      const cleaned = cleanAmharicText(rawChunk);

      if (cleaned) {
        verses.push({
          verse_num: current.verseNum,
          text: cleaned,
          translation_code: 'am-1875',
          book_slug: '',
          chapter: chapterNum,
        });
      }
    }

    // Deduplicate and sort by verse_num
    const seen = new Set<number>();
    const deduplicated = verses.filter((v) => {
      if (seen.has(v.verse_num)) return false;
      seen.add(v.verse_num);
      return true;
    }).sort((a, b) => a.verse_num - b.verse_num);

    amharicChapterCache.set(cacheKey, deduplicated);
    return deduplicated;
  } catch (err) {
    console.error(`[AmharicSyncer] Error reading ${filePath}:`, err);
    return [];
  }
}
