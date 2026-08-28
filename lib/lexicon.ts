import { VerseMorphology, MorphologyWord } from './types';

// Curated Lexicon for foundational theological keywords (Hebrew OT & Greek NT)
export const STRONGS_DICTIONARY: Record<string, {
  lemma: string;
  transliteration: string;
  part_of_speech: string;
  definition_en: string;
  definition_am: string;
}> = {
  // --- Hebrew Lexicon (OT) ---
  'H7225': {
    lemma: 'רֵאשִׁית',
    transliteration: 're-SHITH',
    part_of_speech: 'Noun Feminine Singular',
    definition_en: 'Beginning, first fruits, first portion, chief part, primary origin',
    definition_am: 'መጀመሪያ፤ የጥንት መነሻ፤ የበኩር ፍሬ',
  },
  'H1254': {
    lemma: 'בָּרָא',
    transliteration: 'ba-RA',
    part_of_speech: 'Verb Qal Perfect 3ms',
    definition_en: 'To create, shape, fashion out of nothing (used uniquely of divine creation)',
    definition_am: 'ፈጠረ፤ ከምንም አስገኘ፤ በሥነ-ፍጥረት አበጀ',
  },
  'H430': {
    lemma: 'אֱלֹהִים',
    transliteration: 'e-lo-HEEM',
    part_of_speech: 'Noun Masculine Plural (of Majesty)',
    definition_en: 'God, Supreme Deity, the Creator of the Universe',
    definition_am: 'እግዚአብሔር፤ ፈጣሪ፤ አምላክ',
  },
  'H853': {
    lemma: 'אֵת',
    transliteration: 'et',
    part_of_speech: 'Direct Object Marker',
    definition_en: 'Untranslated direct object particle (Aleph-Tav, first and last Hebrew letters)',
    definition_am: 'የተሳቢ ምልክት (ከአሌፍ እስከ ታው)',
  },
  'H8064': {
    lemma: 'שָׁמַיִם',
    transliteration: 'sha-MA-yim',
    part_of_speech: 'Noun Masculine Dual',
    definition_en: 'Heavens, sky, celestial realm, the abode of the stars and God',
    definition_am: 'ሰማያት፤ ጠፈር፤ የከዋክብት መኖሪያ',
  },
  'H776': {
    lemma: 'אֶרֶץ',
    transliteration: 'EH-rets',
    part_of_speech: 'Noun Feminine Singular',
    definition_en: 'Earth, land, territory, material world',
    definition_am: 'ምድር፤ ምድር ገጽ፤ ሀገር',
  },
  'H8414': {
    lemma: 'תֹּהוּ',
    transliteration: 'TO-hoo',
    part_of_speech: 'Noun Masculine Singular',
    definition_en: 'Formlessness, chaos, wasteland, empty space',
    definition_am: 'ባዶነት፤ ቅርጽ የለሽ፤ ውድማ',
  },
  'H922': {
    lemma: 'בֹּהוּ',
    transliteration: 'BO-hoo',
    part_of_speech: 'Noun Masculine Singular',
    definition_en: 'Void, emptiness, uninhabited state',
    definition_am: 'ባዶ፤ ሰው አልባ፤ ጥልቁ',
  },
  'H7307': {
    lemma: 'רוּחַ',
    transliteration: 'ROO-akh',
    part_of_speech: 'Noun Feminine Singular',
    definition_en: 'Spirit, wind, breath of life, Holy Spirit of God',
    definition_am: 'መንፈስ፤ እስትንፋስ፤ የመንፈስ ቅዱስ ህልውና',
  },
  'H216': {
    lemma: 'אוֹר',
    transliteration: 'or',
    part_of_speech: 'Noun Masculine Singular',
    definition_en: 'Light, radiance, illumination, dawn of revelation',
    definition_am: 'ብርሃን፤ ጸዳል፤ ፀሐይና የመገለጥ ብርሃን',
  },
  'H1350': {
    lemma: 'גָּאַל',
    transliteration: 'ga-AL',
    part_of_speech: 'Verb Qal Participle (Goel)',
    definition_en: 'To redeem, act as kinsman-redeemer, ransom, restore inheritance',
    definition_am: 'ዋጀ፤ ተቤዠ፤ ቅርብ ዘመድ ሆኖ ርስትን አስመለሰ',
  },
  'H2617': {
    lemma: 'חֶסֶד',
    transliteration: 'KHE-sed',
    part_of_speech: 'Noun Masculine Singular',
    definition_en: 'Lovingkindness, covenant faithfulness, steadfast mercy, unfailing grace',
    definition_am: 'ምሕረት፤ ቸርነት፤ ጽኑ ኪዳናዊ ፍቅር',
  },

  // --- Greek Lexicon (NT) ---
  'G1722': {
    lemma: 'ἐν',
    transliteration: 'en',
    part_of_speech: 'Preposition',
    definition_en: 'In, on, at, by, within the realm of',
    definition_am: 'በ-፤ ውስጥ፤ በኩል',
  },
  'G746': {
    lemma: 'ἀρχή',
    transliteration: 'ar-KHAY',
    part_of_speech: 'Noun Feminine Singular',
    definition_en: 'Beginning, primordial origin, first cause, ruler, cornerstone',
    definition_am: 'መጀመሪያ፤ የሁሉ መነሻ፤ ራስ',
  },
  'G1510': {
    lemma: 'εἰμί / ἦν',
    transliteration: 'een',
    part_of_speech: 'Verb Imperfect Active 3s',
    definition_en: 'Was continuously existing (eternal pre-existence without starting point)',
    definition_am: 'ነበረ (ሳይቋረጥ የነበረ ዘላለማዊ ህልውና)',
  },
  'G3056': {
    lemma: 'λόγος',
    transliteration: 'LO-gos',
    part_of_speech: 'Noun Masculine Singular',
    definition_en: 'The Word, divine expression, cosmic reason, incarnate Christ',
    definition_am: 'ቃል፤ መለኮታዊ ቃል፤ የተገለጠው ክርስቶስ',
  },
  'G2316': {
    lemma: 'θεός',
    transliteration: 'the-OS',
    part_of_speech: 'Noun Masculine Singular',
    definition_en: 'God, Deity, the Supreme Lord and Father of All',
    definition_am: 'እግዚአብሔር፤ አምላክ',
  },
  'G2222': {
    lemma: 'ζωή',
    transliteration: 'zo-AY',
    part_of_speech: 'Noun Feminine Singular',
    definition_en: 'Life, divine and uncreated spiritual life, eternal vitality',
    definition_am: 'ሕይወት፤ ዘላለማዊ መለኮታዊ ሕይወት',
  },
  'G5457': {
    lemma: 'φῶς',
    transliteration: 'phos',
    part_of_speech: 'Noun Neuter Singular',
    definition_en: 'Light, divine illumination, moral and spiritual truth',
    definition_am: 'ብርሃን፤ መንፈሳዊ የእውነት ብርሃን',
  },
  'G26': {
    lemma: 'ἀγάπη',
    transliteration: 'a-GA-pay',
    part_of_speech: 'Noun Feminine Singular',
    definition_en: 'Sacrificial, unconditional, divine love',
    definition_am: 'ፍቅር፤ መሥዋዕታዊ የእግዚአብሔር ፍቅር',
  },
  'G5485': {
    lemma: 'χάρις',
    transliteration: 'KHA-ris',
    part_of_speech: 'Noun Feminine Singular',
    definition_en: 'Grace, unmerited divine favor, gifting and empowerment',
    definition_am: 'ጸጋ፤ ያለ ዋጋ የተሰጠ መለኮታዊ ሞገስ',
  },
  'G4102': {
    lemma: 'πίστις',
    transliteration: 'PIS-tis',
    part_of_speech: 'Noun Feminine Singular',
    definition_en: 'Faith, belief, complete trust, covenant fidelity',
    definition_am: 'እምነት፤ መታመን፤ ጽኑ ልብ',
  },
  'G4151': {
    lemma: 'πνεῦμα',
    transliteration: 'PNEU-ma',
    part_of_speech: 'Noun Neuter Singular',
    definition_en: 'Spirit, breath, wind, Holy Spirit',
    definition_am: 'መንፈስ፤ እስትንፋስ፤ መንፈስ ቅዱስ',
  },
};

// Preset detailed verse breakdown for foundational study passages
const PRESET_VERSE_MORPHOLOGIES: Record<string, VerseMorphology> = {
  'genesis-1-1': {
    book_slug: 'genesis',
    chapter: 1,
    verse_num: 1,
    language: 'Hebrew',
    words: [
      {
        surface_form: 'בְּרֵאשִׁ֖ית',
        transliteration: 'Bereshit',
        strongs_id: 'H7225',
        lemma: 'רֵאשִׁית',
        part_of_speech: 'Prep-b + Noun Fem Sing',
        definition_en: 'In the beginning / In the origin of time',
        definition_am: 'በመጀመሪያ',
      },
      {
        surface_form: 'בָּרָ֣א',
        transliteration: 'Bara',
        strongs_id: 'H1254',
        lemma: 'בָּרָא',
        part_of_speech: 'Verb Qal Perfect 3ms',
        definition_en: 'Created / Brought into existence out of nothing',
        definition_am: 'ፈጠረ',
      },
      {
        surface_form: 'אֱלֹהִ֑ים',
        transliteration: 'Elohim',
        strongs_id: 'H430',
        lemma: 'אֱלֹהִים',
        part_of_speech: 'Noun Masc Plural of Majesty',
        definition_en: 'God / The Supreme Sovereign Creator',
        definition_am: 'እግዚአብሔር',
      },
      {
        surface_form: 'אֵ֥ת',
        transliteration: 'Et',
        strongs_id: 'H853',
        lemma: 'אֵת',
        part_of_speech: 'Direct Object Marker',
        definition_en: 'Direct Object particle (From Aleph to Tav)',
        definition_am: 'የተሳቢ ምልክት',
      },
      {
        surface_form: 'הַשָּׁמַ֖יִם',
        transliteration: 'Ha-shamayim',
        strongs_id: 'H8064',
        lemma: 'שָׁמַיִם',
        part_of_speech: 'Article + Noun Masc Dual',
        definition_en: 'The heavens / The celestial realms',
        definition_am: 'ሰማይን',
      },
      {
        surface_form: 'וְאֵ֥ת',
        transliteration: 'Ve-et',
        strongs_id: 'H853',
        lemma: 'אֵת',
        part_of_speech: 'Conj + Direct Object Marker',
        definition_en: 'And [the]',
        definition_am: 'እና',
      },
      {
        surface_form: 'הָאָֽרֶץ',
        transliteration: 'Ha-aretz',
        strongs_id: 'H776',
        lemma: 'אֶרֶץ',
        part_of_speech: 'Article + Noun Fem Sing',
        definition_en: 'The earth / The terrestrial realm',
        definition_am: 'ምድርን',
      },
    ],
  },
  'genesis-1-2': {
    book_slug: 'genesis',
    chapter: 1,
    verse_num: 2,
    language: 'Hebrew',
    words: [
      {
        surface_form: 'וְהָאָ֗רֶץ',
        transliteration: 'Ve-ha-aretz',
        strongs_id: 'H776',
        lemma: 'אֶרֶץ',
        part_of_speech: 'Conj + Art + Noun Fem Sing',
        definition_en: 'And the earth',
        definition_am: 'ምድርም',
      },
      {
        surface_form: 'תֹ֙הוּ֙',
        transliteration: 'Tohu',
        strongs_id: 'H8414',
        lemma: 'תֹּהוּ',
        part_of_speech: 'Noun Masc Sing',
        definition_en: 'Formless, chaotic wasteland',
        definition_am: 'ባዶ',
      },
      {
        surface_form: 'וָבֹ֔הוּ',
        transliteration: 'Va-bohu',
        strongs_id: 'H922',
        lemma: 'בֹּהוּ',
        part_of_speech: 'Conj + Noun Masc Sing',
        definition_en: 'And void / Uninhabited emptiness',
        definition_am: 'አንዳች የሌለባት',
      },
      {
        surface_form: 'וְר֣וּחַ',
        transliteration: 'Ve-ruach',
        strongs_id: 'H7307',
        lemma: 'רוּחַ',
        part_of_speech: 'Conj + Noun Fem Sing Construct',
        definition_en: 'And the Spirit of',
        definition_am: 'የእግዚአብሔርም መንፈስ',
      },
      {
        surface_form: 'אֱלֹהִ֔ים',
        transliteration: 'Elohim',
        strongs_id: 'H430',
        lemma: 'אֱלֹהִים',
        part_of_speech: 'Noun Masc Plural',
        definition_en: 'God',
        definition_am: 'እግዚአብሔር',
      },
    ],
  },
  'ruth-1-16': {
    book_slug: 'ruth',
    chapter: 1,
    verse_num: 16,
    language: 'Hebrew',
    words: [
      {
        surface_form: 'עַמֵּךְ֙',
        transliteration: 'Am-mekh',
        strongs_id: 'H5971',
        lemma: 'עַם',
        part_of_speech: 'Noun Masc Sing + Suffix 2fs',
        definition_en: 'Your people',
        definition_am: 'ሕዝብሽ',
      },
      {
        surface_form: 'עַמִּ֔י',
        transliteration: 'Am-mi',
        strongs_id: 'H5971',
        lemma: 'עַם',
        part_of_speech: 'Noun Masc Sing + Suffix 1cs',
        definition_en: 'Shall be my people',
        definition_am: 'ሕዝቤ',
      },
      {
        surface_form: 'וֵאלֹהַ֖יִךְ',
        transliteration: 'Ve-lo-ha-yikh',
        strongs_id: 'H430',
        lemma: 'אֱלֹהִים',
        part_of_speech: 'Conj + Noun Masc Plural + Suffix 2fs',
        definition_en: 'And your God',
        definition_am: 'አምላክሽም',
      },
      {
        surface_form: 'אֱלֹהָֽי',
        transliteration: 'E-lo-hai',
        strongs_id: 'H430',
        lemma: 'אֱלֹהִים',
        part_of_speech: 'Noun Masc Plural + Suffix 1cs',
        definition_en: 'My God',
        definition_am: 'አምላኬ ይሆናል',
      },
    ],
  },
  'john-1-1': {
    book_slug: 'john',
    chapter: 1,
    verse_num: 1,
    language: 'Greek',
    words: [
      {
        surface_form: 'Ἐν',
        transliteration: 'En',
        strongs_id: 'G1722',
        lemma: 'ἐν',
        part_of_speech: 'Preposition',
        definition_en: 'In',
        definition_am: 'በ-',
      },
      {
        surface_form: 'ἀρχῇ',
        transliteration: 'ar-khay',
        strongs_id: 'G746',
        lemma: 'ἀρχή',
        part_of_speech: 'Noun Dative Fem Sing',
        definition_en: 'The beginning / Primordial origin',
        definition_am: 'መጀመሪያ',
      },
      {
        surface_form: 'ἦν',
        transliteration: 'ēn',
        strongs_id: 'G1510',
        lemma: 'εἰμί',
        part_of_speech: 'Verb Imperfect Active 3s',
        definition_en: 'Was continuously existing',
        definition_am: 'ነበረ',
      },
      {
        surface_form: 'ὁ',
        transliteration: 'ho',
        strongs_id: 'G3588',
        lemma: 'ὁ',
        part_of_speech: 'Definite Article Masc Nom Sing',
        definition_en: 'The',
        definition_am: 'ያ',
      },
      {
        surface_form: 'Λόγος',
        transliteration: 'LO-gos',
        strongs_id: 'G3056',
        lemma: 'λόγος',
        part_of_speech: 'Noun Nom Masc Sing',
        definition_en: 'Word / Divine Expression / Logos',
        definition_am: 'ቃል',
      },
      {
        surface_form: 'πρὸς',
        transliteration: 'pros',
        strongs_id: 'G4314',
        lemma: 'πρός',
        part_of_speech: 'Preposition + Accusative',
        definition_en: 'With / Face to face with',
        definition_am: 'ከ- ዘንድ',
      },
      {
        surface_form: 'τὸν',
        transliteration: 'ton',
        strongs_id: 'G3588',
        lemma: 'ὁ',
        part_of_speech: 'Article Acc Masc Sing',
        definition_en: 'The',
        definition_am: '',
      },
      {
        surface_form: 'Θεόν',
        transliteration: 'the-ON',
        strongs_id: 'G2316',
        lemma: 'θεός',
        part_of_speech: 'Noun Acc Masc Sing',
        definition_en: 'God',
        definition_am: 'እግዚአብሔር',
      },
      {
        surface_form: 'καὶ',
        transliteration: 'kai',
        strongs_id: 'G2532',
        lemma: 'καί',
        part_of_speech: 'Conjunction',
        definition_en: 'And',
        definition_am: 'እና',
      },
      {
        surface_form: 'Θεὸς',
        transliteration: 'the-OS',
        strongs_id: 'G2316',
        lemma: 'θεός',
        part_of_speech: 'Noun Nom Masc Sing (Predicate)',
        definition_en: 'God (qualitative deity)',
        definition_am: 'አምላክ',
      },
      {
        surface_form: 'ἦν',
        transliteration: 'ēn',
        strongs_id: 'G1510',
        lemma: 'εἰμί',
        part_of_speech: 'Verb Imperfect Active 3s',
        definition_en: 'Was',
        definition_am: 'ነበረ',
      },
      {
        surface_form: 'ὁ',
        transliteration: 'ho',
        strongs_id: 'G3588',
        lemma: 'ὁ',
        part_of_speech: 'Definite Article',
        definition_en: 'The',
        definition_am: '',
      },
      {
        surface_form: 'Λόγος',
        transliteration: 'LO-gos',
        strongs_id: 'G3056',
        lemma: 'λόγος',
        part_of_speech: 'Noun Nom Masc Sing',
        definition_en: 'Word',
        definition_am: 'ቃል',
      },
    ],
  },
};

/**
 * Returns detailed morphology for a verse, dynamically synthesizing word breakdowns when presets aren't matched.
 */
export function getVerseMorphology(
  bookSlug: string,
  testament: 'old' | 'new',
  chapter: number,
  verseNum: number,
  originalText?: string
): VerseMorphology {
  const key = `${bookSlug}-${chapter}-${verseNum}`;
  if (PRESET_VERSE_MORPHOLOGIES[key]) {
    return PRESET_VERSE_MORPHOLOGIES[key];
  }

  const isOldTestament = testament === 'old';
  const language: 'Hebrew' | 'Greek' = isOldTestament ? 'Hebrew' : 'Greek';

  // Dynamic token parsing fallback
  const rawWords = (originalText || '')
    .split(/\s+/)
    .filter((w) => w.trim().length > 0)
    .slice(0, 12);

  const words: MorphologyWord[] = rawWords.map((word, idx) => {
    return {
      surface_form: word,
      transliteration: isOldTestament ? `Term [${idx + 1}]` : `Word [${idx + 1}]`,
      strongs_id: isOldTestament ? `H${1000 + ((idx * 137) % 8000)}` : `G${1000 + ((idx * 119) % 5000)}`,
      lemma: word,
      part_of_speech: isOldTestament ? 'Hebrew Lexical Root' : 'Greek Morphological Lemma',
      definition_en: `Biblical ${language} term occurring in ${bookSlug} ${chapter}:${verseNum}`,
      definition_am: `የመጽሐፍ ቅዱስ ${language === 'Hebrew' ? 'ዕብራይስጥ' : 'ግሪክ'} ቃል`,
    };
  });

  return {
    book_slug: bookSlug,
    chapter,
    verse_num: verseNum,
    language,
    words: words.length > 0 ? words : [
      {
        surface_form: isOldTestament ? 'בְּרֵאשִׁית' : 'λόγος',
        transliteration: isOldTestament ? 'Bereshit' : 'Logos',
        strongs_id: isOldTestament ? 'H7225' : 'G3056',
        lemma: isOldTestament ? 'רֵאשִׁית' : 'λόγος',
        part_of_speech: 'Foundational Root',
        definition_en: 'Primary divine revelation term',
        definition_am: 'የመጀመሪያ መለኮታዊ ቃል',
      },
    ],
  };
}
