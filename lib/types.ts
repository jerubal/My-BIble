export type ScriptDirection = 'ltr' | 'rtl';
export type Testament = 'old' | 'new';
export type LicenseType = 'public_domain' | 'creative_commons' | 'licensed';
export type HighlightColor =
  | 'yellow'
  | 'gold'
  | 'orange'
  | 'green'
  | 'emerald'
  | 'cyan'
  | 'blue'
  | 'indigo'
  | 'purple'
  | 'pink'
  | 'rose'
  | 'slate';

export interface Translation {
  id: number;
  code: string;
  short_code?: string;
  language: string;
  name: string;
  description?: string;
  license_type: LicenseType;
  source_url: string | null;
  is_active: boolean;
  year?: number | string;
  testament_scope?: 'both' | 'old' | 'new';
  features?: string[];
  created_at?: string;
  script_direction: ScriptDirection;
}

export interface Book {
  id: number;
  testament: Testament;
  book_order: number;
  slug: string;
  name_en: string;
  name_am: string | null;
  name_he: string | null;
  name_gr: string | null;
  chapter_count: number;
}

export interface TranslationVerse {
  verse_num: number;
  text: string;
  translation_code: string;
  book_slug: string;
  chapter: number;
}

export interface Verse {
  id: number;
  book_id: number;
  chapter: number;
  verse_num: number;
  translation_id: number;
  text: string;
  translation_code?: string;
}

export interface AlignedVerse {
  verse_num: number;
  translations: Record<string, {
    text: string;
    translation_id: number;
    translation_code: string;
    language: string;
    name: string;
    script_direction: ScriptDirection;
  }>;
}

export interface ChapterData {
  book: Book;
  chapter: number;
  total_chapters: number;
  active_translations: Translation[];
  verses: AlignedVerse[];
  prev_chapter: { book_slug: string; chapter: number } | null;
  next_chapter: { book_slug: string; chapter: number } | null;
}

export interface DailyVerse {
  date: string;
  book_id?: number;
  book_slug?: string;
  book_name?: string;
  book_name_am?: string;
  chapter: number;
  verse_num: number;
  book?: Book;
  verses?: Record<string, string>;
  verse_text_en?: string;
  verse_text_am?: string;
}

export interface SavedHighlight {
  id: string; // e.g. "genesis-1-1"
  book_slug: string;
  book_name: string;
  chapter: number;
  verse_num: number;
  color: HighlightColor;
  translation_code: string;
  verse_text: string;
  created_at: string;
}

export interface SavedFavorite {
  id: string; // e.g. "genesis-1-1"
  book_slug: string;
  book_name: string;
  chapter: number;
  verse_num: number;
  translation_code: string;
  verse_text: string;
  created_at: string;
}

export interface SavedNote {
  id: string; // e.g. "genesis-1-1"
  book_slug: string;
  book_name: string;
  chapter: number;
  verse_num: number;
  note_text: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface MorphologyWord {
  surface_form: string; // Word as it appears in text
  transliteration: string; // Romanized phonetic reading
  strongs_id: string; // e.g. "H7225" or "G3056"
  lemma: string; // Dictionary base root (e.g. רֵאשִׁית or λόγος)
  part_of_speech: string; // e.g. "Noun, feminine singular" or "Verb, Qal Perfect"
  definition_en: string; // Concise English definition
  definition_am?: string; // Amharic theological gloss
}

export interface VerseMorphology {
  book_slug: string;
  chapter: number;
  verse_num: number;
  language: 'Hebrew' | 'Greek';
  words: MorphologyWord[];
}

export interface CrossReference {
  target_book_slug: string;
  target_book_name: string;
  target_chapter: number;
  target_verse_start: number;
  target_verse_end?: number;
  theme?: string;
  preview_text_en?: string;
  preview_text_am?: string;
}

export interface IngestionLog {
  id?: number;
  source: string;
  started_at: string;
  completed_at?: string;
  verse_count?: number;
  status: 'success' | 'failed' | 'partial';
  error_detail?: string;
}
