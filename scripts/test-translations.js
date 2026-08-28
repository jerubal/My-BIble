const fs = require('fs');
const path = require('path');

function cleanAmharicText(raw) {
  if (!raw) return '';
  return raw
    .replace(/<[^>]+>/g, '') // remove HTML tags
    .replace(/&nbsp;/g, ' ')
    .replace(/^[፤፦\s\d]+/, '') // remove leading punctuation or stray numbers
    .replace(/\s+/g, ' ')
    .trim();
}

function getAmharicChapterVersesFromDisk(bookOrder, chapterNum) {
  const paddedBook = bookOrder.toString().padStart(2, '0');
  const filePath = path.join(process.cwd(), 'am_new', paddedBook, `${chapterNum}.htm`);

  if (!fs.existsSync(filePath)) {
    return [];
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const textBodyMatch = content.match(/<div class="textBody" id="textBody">([\s\S]*?)<\/div>/i);
  if (!textBodyMatch) return [];

  const body = textBodyMatch[1];
  const verses = [];

  const verseRegex = /<span\s+class=["']verse["']\s+id=["'](\d+)["']>\s*\d*\s*<\/span>/gi;
  const markers = [];

  let match;
  while ((match = verseRegex.exec(body)) !== null) {
    markers.push({
      verseNum: parseInt(match[1], 10),
      index: match.index,
      length: match[0].length,
    });
  }

  if (markers.length === 0) return [];

  const beforeFirst = body.substring(0, markers[0].index);
  const v1Clean = cleanAmharicText(beforeFirst.replace(/<h3>[\s\S]*?<\/h3>/i, ''));
  if (v1Clean && (!markers[0] || markers[0].verseNum > 1)) {
    verses.push({
      verse_num: 1,
      text: v1Clean,
    });
  }

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
      });
    }
  }

  return verses;
}

const sampleTests = [
  { order: 1, name: 'Genesis', chapter: 1 },
  { order: 8, name: 'Ruth', chapter: 1 },
  { order: 19, name: 'Psalms', chapter: 23 },
  { order: 43, name: 'John', chapter: 1 },
  { order: 66, name: 'Revelation', chapter: 22 },
];

console.log('=== VERIFYING AMHARIC CHAPTER TRANSLATIONS ===');
for (const t of sampleTests) {
  const verses = getAmharicChapterVersesFromDisk(t.order, t.chapter);
  console.log(`✓ ${t.name} Chapter ${t.chapter}: ${verses.length} verses loaded`);
  if (verses.length > 0) {
    console.log(`  Verse 1: "${verses[0].text}"`);
    console.log(`  Last Verse (${verses[verses.length-1].verse_num}): "${verses[verses.length-1].text}"`);
  } else {
    console.error(`  FAILED: No verses for ${t.name} ${t.chapter}`);
  }
}
