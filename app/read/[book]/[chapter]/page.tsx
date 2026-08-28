import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBookBySlug, getChapterVerses, getTranslations, getBooks } from '@/lib/db';
import { ChapterData } from '@/lib/types';
import { ReaderClient } from './ReaderClient';

interface PageProps {
  params: {
    book: string;
    chapter: string;
  };
  searchParams: {
    v?: string;
  };
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const book = await getBookBySlug(params.book);
  if (!book) return { title: 'Passage Not Found' };

  const chapterNum = parseInt(params.chapter, 10);
  const verseParam = searchParams.v;
  const title = verseParam
    ? `${book.name_en} ${chapterNum}:${verseParam} | Multilingual Bible`
    : `${book.name_en} Chapter ${chapterNum} | Multilingual Bible (Amharic, English, Hebrew, Greek)`;

  const description = `Read ${book.name_en} ${chapterNum} side-by-side in Amharic (${book.name_am || ''}), English, Hebrew (${book.name_he || ''}), and Greek (${book.name_gr || ''}).`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

export default async function ChapterPage({ params }: PageProps) {
  const bookSlug = params.book.toLowerCase();
  const chapterNum = parseInt(params.chapter, 10);

  const book = await getBookBySlug(bookSlug);
  if (!book || isNaN(chapterNum) || chapterNum < 1 || chapterNum > book.chapter_count) {
    notFound();
  }

  // TypeScript assertion after notFound()
  const validBook = book!;

  const allTranslations = await getTranslations();
  const allBooks = await getBooks();
  const verses = await getChapterVerses(validBook.slug, chapterNum);

  const currentBookIndex = allBooks.findIndex((b) => b.slug === validBook.slug);
  let prevChapter: { book_slug: string; chapter: number } | null = null;
  let nextChapter: { book_slug: string; chapter: number } | null = null;

  if (chapterNum > 1) {
    prevChapter = { book_slug: validBook.slug, chapter: chapterNum - 1 };
  } else if (currentBookIndex > 0) {
    const prevBook = allBooks[currentBookIndex - 1];
    prevChapter = { book_slug: prevBook.slug, chapter: prevBook.chapter_count };
  }

  if (chapterNum < validBook.chapter_count) {
    nextChapter = { book_slug: validBook.slug, chapter: chapterNum + 1 };
  } else if (currentBookIndex < allBooks.length - 1) {
    const nextBook = allBooks[currentBookIndex + 1];
    nextChapter = { book_slug: nextBook.slug, chapter: 1 };
  }

  const chapterData: ChapterData = {
    book: validBook,
    chapter: chapterNum,
    total_chapters: validBook.chapter_count,
    active_translations: allTranslations,
    verses,
    prev_chapter: prevChapter,
    next_chapter: nextChapter,
  };

  return (
    <ReaderClient
      initialData={chapterData}
      allBooks={allBooks}
      allTranslations={allTranslations}
    />
  );
}
