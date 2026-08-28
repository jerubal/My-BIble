import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBookBySlug, getBooks } from '@/lib/db';
import { ChapterPickerClient } from './ChapterPickerClient';

interface PageProps {
  params: {
    book: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const book = await getBookBySlug(params.book);
  if (!book) return { title: 'Book Not Found' };

  return {
    title: `${book.name_en} (${book.name_am || ''}) - Select Chapter | Multilingual Bible`,
    description: `Select a chapter of ${book.name_en} to read across Amharic, English, Hebrew, and Greek.`,
  };
}

export default async function BookChapterSelectPage({ params }: PageProps) {
  const book = await getBookBySlug(params.book);
  if (!book) {
    notFound();
  }

  const allBooks = await getBooks();

  return (
    <ChapterPickerClient
      book={book}
      allBooks={allBooks}
    />
  );
}
