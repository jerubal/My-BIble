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

function getAmharicChapterVerses(bookOrder, chapterNum) {
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

// 66 Books Metadata
const books = [
  { order: 1, slug: 'genesis', name_en: 'Genesis', name_am: 'ኦሪት ዘፍጥረት', chapters: 50 },
  { order: 2, slug: 'exodus', name_en: 'Exodus', name_am: 'ኦሪት ዘጸአት', chapters: 40 },
  { order: 3, slug: 'leviticus', name_en: 'Leviticus', name_am: 'ኦሪት ዘሌዋውያን', chapters: 27 },
  { order: 4, slug: 'numbers', name_en: 'Numbers', name_am: 'ኦሪት ዘኍልቍ', chapters: 36 },
  { order: 5, slug: 'deuteronomy', name_en: 'Deuteronomy', name_am: 'ኦሪት ዘዳግም', chapters: 34 },
  { order: 6, slug: 'joshua', name_en: 'Joshua', name_am: 'መጽሐፈ ኢያሱ', chapters: 24 },
  { order: 7, slug: 'judges', name_en: 'Judges', name_am: 'መጽሐፈ መሳፍንት', chapters: 21 },
  { order: 8, slug: 'ruth', name_en: 'Ruth', name_am: 'መጽሐፈ ሩት', chapters: 4 },
  { order: 9, slug: '1-samuel', name_en: '1 Samuel', name_am: 'መጽሐፈ ሳሙኤል ቀዳማዊ', chapters: 31 },
  { order: 10, slug: '2-samuel', name_en: '2 Samuel', name_am: 'መጽሐፈ ሳሙኤል ካልእ', chapters: 24 },
  { order: 11, slug: '1-kings', name_en: '1 Kings', name_am: 'መጽሐፈ ነገሥት ቀዳማዊ', chapters: 22 },
  { order: 12, slug: '2-kings', name_en: '2 Kings', name_am: 'መጽሐፈ ነገሥት ካልእ', chapters: 25 },
  { order: 13, slug: '1-chronicles', name_en: '1 Chronicles', name_am: 'መጽሐፈ ዜና መዋዕል ቀዳማዊ', chapters: 29 },
  { order: 14, slug: '2-chronicles', name_en: '2 Chronicles', name_am: 'መጽሐፈ ዜና መዋዕል ካልእ', chapters: 36 },
  { order: 15, slug: 'ezra', name_en: 'Ezra', name_am: 'መጽሐፈ ዕዝራ', chapters: 10 },
  { order: 16, slug: 'nehemiah', name_en: 'Nehemiah', name_am: 'መጽሐፈ ነህምያ', chapters: 13 },
  { order: 17, slug: 'esther', name_en: 'Esther', name_am: 'መጽሐፈ አስቴር', chapters: 10 },
  { order: 18, slug: 'job', name_en: 'Job', name_am: 'መጽሐፈ ኢዮብ', chapters: 42 },
  { order: 19, slug: 'psalms', name_en: 'Psalms', name_am: 'መዝሙረ ዳዊት', chapters: 150 },
  { order: 20, slug: 'proverbs', name_en: 'Proverbs', name_am: 'መጽሐፈ ምሳሌ', chapters: 31 },
  { order: 21, slug: 'ecclesiastes', name_en: 'Ecclesiastes', name_am: 'መጽሐፈ መክብብ', chapters: 12 },
  { order: 22, slug: 'song-of-solomon', name_en: 'Song of Solomon', name_am: 'መኃልየ መኃልይ ዘሰሎሞን', chapters: 8 },
  { order: 23, slug: 'isaiah', name_en: 'Isaiah', name_am: 'ትንቢተ ኢሳይያስ', chapters: 66 },
  { order: 24, slug: 'jeremiah', name_en: 'Jeremiah', name_am: 'ትንቢተ ኤርምያስ', chapters: 52 },
  { order: 25, slug: 'lamentations', name_en: 'Lamentations', name_am: 'ሰቆቃወ ኤርምያስ', chapters: 5 },
  { order: 26, slug: 'ezekiel', name_en: 'Ezekiel', name_am: 'ትንቢተ ሕዝቅኤል', chapters: 48 },
  { order: 27, slug: 'daniel', name_en: 'Daniel', name_am: 'ትንቢተ ዳንኤል', chapters: 12 },
  { order: 28, slug: 'hosea', name_en: 'Hosea', name_am: 'ትንቢተ ሆሴዕ', chapters: 14 },
  { order: 29, slug: 'joel', name_en: 'Joel', name_am: 'ትንቢተ ኢዩኤል', chapters: 3 },
  { order: 30, slug: 'amos', name_en: 'Amos', name_am: 'ትንቢተ አሞጽ', chapters: 9 },
  { order: 31, slug: 'obadiah', name_en: 'Obadiah', name_am: 'ትንቢተ አብድዩ', chapters: 1 },
  { order: 32, slug: 'jonah', name_en: 'Jonah', name_am: 'ትንቢተ ዮናስ', chapters: 4 },
  { order: 33, slug: 'micah', name_en: 'Micah', name_am: 'ትንቢተ ሚክያስ', chapters: 7 },
  { order: 34, slug: 'nahum', name_en: 'Nahum', name_am: 'ትንቢተ ናሆም', chapters: 3 },
  { order: 35, slug: 'habakkuk', name_en: 'Habakkuk', name_am: 'ትንቢተ ዕንባቆም', chapters: 3 },
  { order: 36, slug: 'zephaniah', name_en: 'Zephaniah', name_am: 'ትንቢተ ሶፎንያስ', chapters: 3 },
  { order: 37, slug: 'haggai', name_en: 'Haggai', name_am: 'ትንቢተ ሐጌ', chapters: 2 },
  { order: 38, slug: 'zechariah', name_en: 'Zechariah', name_am: 'ትንቢተ ዘካርያስ', chapters: 14 },
  { order: 39, slug: 'malachi', name_en: 'Malachi', name_am: 'ትንቢተ ሚልክያስ', chapters: 4 },
  { order: 40, slug: 'matthew', name_en: 'Matthew', name_am: 'የማቴዎስ ወንጌል', chapters: 28 },
  { order: 41, slug: 'mark', name_en: 'Mark', name_am: 'የማርቆስ ወንጌል', chapters: 16 },
  { order: 42, slug: 'luke', name_en: 'Luke', name_am: 'የሉቃስ ወንጌል', chapters: 24 },
  { order: 43, slug: 'john', name_en: 'John', name_am: 'የዮሐንስ ወንጌል', chapters: 21 },
  { order: 44, slug: 'acts', name_en: 'Acts', name_am: 'የሐዋርያት ሥራ', chapters: 28 },
  { order: 45, slug: 'romans', name_en: 'Romans', name_am: 'ወደ ሮሜ ሰዎች', chapters: 16 },
  { order: 46, slug: '1-corinthians', name_en: '1 Corinthians', name_am: '1ኛ ወደ ቆሮንቶስ ሰዎች', chapters: 16 },
  { order: 47, slug: '2-corinthians', name_en: '2 Corinthians', name_am: '2ኛ ወደ ቆሮንቶስ ሰዎች', chapters: 13 },
  { order: 48, slug: 'galatians', name_en: 'Galatians', name_am: 'ወደ ገላትያ ሰዎች', chapters: 6 },
  { order: 49, slug: 'ephesians', name_en: 'Ephesians', name_am: 'ወደ ኤፌሶን ሰዎች', chapters: 6 },
  { order: 50, slug: 'philippians', name_en: 'Philippians', name_am: 'ወደ ፊልጵስዩስ ሰዎች', chapters: 4 },
  { order: 51, slug: 'colossians', name_en: 'Colossians', name_am: 'ወደ ቆላስይስ ሰዎች', chapters: 4 },
  { order: 52, slug: '1-thessalonians', name_en: '1 Thessalonians', name_am: '1ኛ ወደ ተሰሎንቄ ሰዎች', chapters: 5 },
  { order: 53, slug: '2-thessalonians', name_en: '2 Thessalonians', name_am: '2ኛ ወደ ተሰሎንቄ ሰዎች', chapters: 3 },
  { order: 54, slug: '1-timothy', name_en: '1 Timothy', name_am: '1ኛ ወደ ጢሞቴዎስ', chapters: 6 },
  { order: 55, slug: '2-timothy', name_en: '2 Timothy', name_am: '2ኛ ወደ ጢሞቴዎስ', chapters: 4 },
  { order: 56, slug: 'titus', name_en: 'Titus', name_am: 'ወደ ቲቶ', chapters: 3 },
  { order: 57, slug: 'philemon', name_en: 'Philemon', name_am: 'ወደ ፊልሞና', chapters: 1 },
  { order: 58, slug: 'hebrews', name_en: 'Hebrews', name_am: 'ወደ ዕብራውያን', chapters: 13 },
  { order: 59, slug: 'james', name_en: 'James', name_am: 'የያዕቆብ መልእክት', chapters: 5 },
  { order: 60, slug: '1-peter', name_en: '1 Peter', name_am: '1ኛ የጴጥሮስ መልእክት', chapters: 5 },
  { order: 61, slug: '2-peter', name_en: '2 Peter', name_am: '2ኛ የጴጥሮስ መልእክት', chapters: 3 },
  { order: 62, slug: '1-john', name_en: '1 John', name_am: '1ኛ የዮሐንስ መልእክት', chapters: 5 },
  { order: 63, slug: '2-john', name_en: '2 John', name_am: '2ኛ የዮሐንስ መልእክት', chapters: 1 },
  { order: 64, slug: '3-john', name_en: '3 John', name_am: '3ኛ የዮሐንስ መልእክት', chapters: 1 },
  { order: 65, slug: 'jude', name_en: 'Jude', name_am: 'የይሁዳ መልእክት', chapters: 1 },
  { order: 66, slug: 'revelation', name_en: 'Revelation', name_am: 'የዮሐንስ ራእይ', chapters: 22 },
];

console.log('=== AUDITING ALL 66 BOOKS OF SCRIPTURE ===\n');

let totalChaptersChecked = 0;
let totalVersesCounted = 0;
let booksWithMissingChapters = [];

for (const b of books) {
  let bookVerses = 0;
  let missing = [];

  for (let ch = 1; ch <= b.chapters; ch++) {
    const verses = getAmharicChapterVerses(b.order, ch);
    totalChaptersChecked++;
    if (verses.length === 0) {
      missing.push(ch);
    } else {
      bookVerses += verses.length;
      totalVersesCounted += verses.length;
    }
  }

  if (missing.length > 0) {
    console.error(`❌ Book ${b.order}. ${b.name_en} (${b.name_am}): Missing ${missing.length} chapters (${missing.slice(0, 5).join(', ')}...)`);
    booksWithMissingChapters.push({ book: b.name_en, missing });
  } else {
    console.log(`✓ [${String(b.order).padStart(2, ' ')}/66] ${b.name_en.padEnd(16, ' ')} (${b.name_am.padEnd(24, ' ')}) : ${b.chapters} chs, ${bookVerses} verses`);
  }
}

console.log('\n=========================================');
console.log(`Total Books Checked: ${books.length} / 66`);
console.log(`Total Chapters Checked: ${totalChaptersChecked} / 1189`);
console.log(`Total Verses Verified: ${totalVersesCounted}`);
console.log(`Books with missing data: ${booksWithMissingChapters.length}`);
console.log('=========================================');
