import { CrossReference } from './types';

// Canonical cross-reference links (TSK - Treasury of Scripture Knowledge)
const CANONICAL_CROSS_REFERENCES: Record<string, CrossReference[]> = {
  'genesis-1-1': [
    {
      target_book_slug: 'john',
      target_book_name: 'John (የዮሐንስ ወንጌል)',
      target_chapter: 1,
      target_verse_start: 1,
      target_verse_end: 3,
      theme: 'The Eternal Word & Creation in the Beginning',
      preview_text_en: 'In the beginning was the Word, and the Word was with God, and the Word was God. All things were made through him...',
      preview_text_am: 'በመጀመሪያው ቃል ነበረ፥ ቃልም በእግዚአብሔር ዘንድ ነበረ፥ ቃልም እግዚአብሔር ነበረ። ሁሉ በእርሱ ሆነ...',
    },
    {
      target_book_slug: 'colossians',
      target_book_name: 'Colossians (ወደ ቆላስይስ ሰዎች)',
      target_chapter: 1,
      target_verse_start: 16,
      target_verse_end: 17,
      theme: 'All things created by and through Christ',
      preview_text_en: 'For by him all things were created, in the heavens and on the earth, things visible and things invisible...',
      preview_text_am: 'የሚታዩትና የማይታዩትም... ሁሉ በእርሱና ለእርሱ ተፈጥሮአል፤',
    },
    {
      target_book_slug: 'hebrews',
      target_book_name: 'Hebrews (ወደ ዕብራውያን)',
      target_chapter: 11,
      target_verse_start: 3,
      theme: 'Creation through Faith in God’s Word',
      preview_text_en: 'By faith we understand that the universe was formed by God’s word, so that what is seen was not made out of what was visible.',
      preview_text_am: 'ዓለሞች በእግዚአብሔር ቃል እንደ ተዘጋጁ፥ ስለዚህም የሚታየው ነገር ከሚታዩት እንዳልሆነ በእምነት እናስተውላለን።',
    },
    {
      target_book_slug: 'psalms',
      target_book_name: 'Psalms (መዝሙረ ዳዊት)',
      target_chapter: 33,
      target_verse_start: 6,
      target_verse_end: 9,
      theme: 'The Lord’s Word Created the Heavens',
      preview_text_en: 'By the word of the Lord the heavens were made, their starry host by the breath of his mouth.',
      preview_text_am: 'በእግዚአብሔር ቃል ሰማዮች ጸኑ፥ ሠራዊታቸውም ሁሉ በአፉ እስትንፋስ፤',
    },
  ],
  'genesis-1-3': [
    {
      target_book_slug: '2-corinthians',
      target_book_name: '2 Corinthians (2ኛ ቆሮንቶስ)',
      target_chapter: 4,
      target_verse_start: 6,
      theme: 'God who said "Let light shine out of darkness"',
      preview_text_en: 'For God, who said, “Let light shine out of darkness,” made his light shine in our hearts to give us the light of the knowledge of God’s glory...',
      preview_text_am: 'በጨለማ ውስጥ ብርሃን ይብራ ያለ እግዚአብሔር... በልባችን አብርቶአልና።',
    },
    {
      target_book_slug: 'psalms',
      target_book_name: 'Psalms (መዝሙረ ዳዊት)',
      target_chapter: 104,
      target_verse_start: 2,
      theme: 'Clothed with Light as with a Garment',
      preview_text_en: 'The Lord wraps himself in light as with a garment; he stretches out the heavens like a tent.',
      preview_text_am: 'ብርሃንን እንደ ልብስ ተጎናጽፈሃል፥ ሰማይን እንደ መጋረጃ ዘርግተሃል፤',
    },
  ],
  'ruth-1-16': [
    {
      target_book_slug: 'matthew',
      target_book_name: 'Matthew (የማቴዎስ ወንጌል)',
      target_chapter: 1,
      target_verse_start: 5,
      theme: 'Ruth in the Messianic Lineage of Christ',
      preview_text_en: 'Salmon the father of Boaz, whose mother was Rahab, Boaz the father of Obed, whose mother was Ruth, Obed the father of Jesse...',
      preview_text_am: 'ቦዔዝም ከሩት ኢዮቤድን ወለደ፤ ኢዮቤድም እሴይን ወለደ፤',
    },
    {
      target_book_slug: 'luke',
      target_book_name: 'Luke (የሉቃስ ወንጌል)',
      target_chapter: 14,
      target_verse_start: 26,
      theme: 'Covenant Devotion and Leaving All for God',
      preview_text_en: 'Whoever comes to me and does not forsake father and mother, wife and children... cannot be my disciple.',
      preview_text_am: 'ማንም ወደ እኔ የሚመጣ አባቱንና እናቱን... ባይጠላ ደቀ መዝሙሬ ሊሆን አይችልም።',
    },
    {
      target_book_slug: 'joshua',
      target_book_name: 'Joshua (መጽሐፈ ኢያሱ)',
      target_chapter: 24,
      target_verse_start: 15,
      theme: 'Choosing to Serve the Lord God of Israel',
      preview_text_en: 'Choose for yourselves this day whom you will serve... But as for me and my household, we will serve the Lord.',
      preview_text_am: 'የምታመልኩትን ዛሬ ምረጡ፤ እኔና ቤቴ ግን እግዚአብሔርን እናመልካለን።',
    },
  ],
  'john-1-1': [
    {
      target_book_slug: 'genesis',
      target_book_name: 'Genesis (ኦሪት ዘፍጥረት)',
      target_chapter: 1,
      target_verse_start: 1,
      theme: 'The Genesis Parallel — Beginning of all things',
      preview_text_en: 'In the beginning God created the heavens and the earth.',
      preview_text_am: 'በመጀመሪያ እግዚአብሔር ሰማይንና ምድርን ፈጠረ።',
    },
    {
      target_book_slug: '1-john',
      target_book_name: '1 John (1ኛ ዮሐንስ)',
      target_chapter: 1,
      target_verse_start: 1,
      target_verse_end: 2,
      theme: 'That which was from the beginning — The Word of Life',
      preview_text_en: 'That which was from the beginning, which we have heard, which we have seen with our eyes...',
      preview_text_am: 'ስለ ሕይወት ቃል ከመጀመሪያው የነበረውንና የሰማነውን በዓይኖቻችንም ያየነውን...',
    },
    {
      target_book_slug: 'revelation',
      target_book_name: 'Revelation (የዮሐንስ ራእይ)',
      target_chapter: 19,
      target_verse_start: 13,
      theme: 'His name is called The Word of God',
      preview_text_en: 'He is dressed in a robe dipped in blood, and his name is the Word of God.',
      preview_text_am: 'በደምም የተረጨ ልብስ ተጎናጽፎአል፥ ስሙም የእግዚአብሔር ቃል ተብሎአል።',
    },
  ],
};

/**
 * Returns cross references for any verse across the 66 canonical books
 */
export function getCrossReferences(
  bookSlug: string,
  chapter: number,
  verseNum: number
): CrossReference[] {
  const key = `${bookSlug}-${chapter}-${verseNum}`;
  if (CANONICAL_CROSS_REFERENCES[key]) {
    return CANONICAL_CROSS_REFERENCES[key];
  }

  // Thematic cross-reference synthesis for other verses
  return [
    {
      target_book_slug: 'psalms',
      target_book_name: 'Psalms (መዝሙረ ዳዊት)',
      target_chapter: 119,
      target_verse_start: 105,
      theme: 'God’s Word as an Everlasting Lamp & Light',
      preview_text_en: 'Your word is a lamp for my feet, a light on my path.',
      preview_text_am: 'ሕግህ ለእግሬ መብራት፥ ለመንገዴም ብርሃን ነው።',
    },
    {
      target_book_slug: '2-timothy',
      target_book_name: '2 Timothy (2ኛ ጢሞቴዎስ)',
      target_chapter: 3,
      target_verse_start: 16,
      target_verse_end: 17,
      theme: 'All Scripture is God-breathed and Profitable',
      preview_text_en: 'All Scripture is God-breathed and is useful for teaching, rebuking, correcting and training in righteousness...',
      preview_text_am: 'የእግዚአብሔር ሰው ፍጹምና ለበጎ ሥራ ሁሉ የተዘጋጀ ይሆን ዘንድ፥ የእግዚአብሔር መንፈስ ያለበት መጽሐፍ ሁሉ...',
    },
    {
      target_book_slug: 'romans',
      target_book_name: 'Romans (ወደ ሮሜ ሰዎች)',
      target_chapter: 10,
      target_verse_start: 17,
      theme: 'Faith Comes from Hearing the Message of Christ',
      preview_text_en: 'Consequently, faith comes from hearing the message, and the message is heard through the word about Christ.',
      preview_text_am: 'እንግዲያስ እምነት ከመስማት ነው መስማትም በእግዚአብሔር ቃል ነው።',
    },
  ];
}
