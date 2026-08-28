import { NextRequest, NextResponse } from 'next/server';
import { getBookBySlug, getChapterVerses, getTranslations, getBooks } from '@/lib/db';
import { ChapterData } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookSlug = searchParams.get('book')?.toLowerCase() || 'genesis';
    const chapter = parseInt(searchParams.get('chapter') || '1', 10);
    const translationsParam = searchParams.get('translations');

    // 1. Fetch book record using books.slug
    const book = await getBookBySlug(bookSlug);
    if (!book) {
      return NextResponse.json(
        { success: false, error: `Book '${bookSlug}' not found` },
        { status: 404 }
      );
    }

    // 2. Validate chapter range
    if (isNaN(chapter) || chapter < 1 || chapter > book.chapter_count) {
      return NextResponse.json(
        { success: false, error: `Invalid chapter ${chapter} for book ${book.name_en} (1-${book.chapter_count})` },
        { status: 400 }
      );
    }

    // 3. Resolve requested translations
    const allTranslations = await getTranslations();
    const activeTranslationCodes = translationsParam
      ? translationsParam.split(',').map((c) => c.trim()).filter(Boolean)
      : allTranslations.map((t) => t.code);

    const activeTranslations = allTranslations.filter((t) =>
      activeTranslationCodes.includes(t.code)
    );

    // 4. Fetch aligned verses for chapter
    const verses = await getChapterVerses(book.slug, chapter, activeTranslationCodes);

    // 5. Calculate previous and next chapter links
    const allBooks = await getBooks();
    const currentBookIndex = allBooks.findIndex((b) => b.slug === book.slug);

    let prevChapter: { book_slug: string; chapter: number } | null = null;
    let nextChapter: { book_slug: string; chapter: number } | null = null;

    if (chapter > 1) {
      prevChapter = { book_slug: book.slug, chapter: chapter - 1 };
    } else if (currentBookIndex > 0) {
      const prevBook = allBooks[currentBookIndex - 1];
      prevChapter = { book_slug: prevBook.slug, chapter: prevBook.chapter_count };
    }

    if (chapter < book.chapter_count) {
      nextChapter = { book_slug: book.slug, chapter: chapter + 1 };
    } else if (currentBookIndex < allBooks.length - 1) {
      const nextBook = allBooks[currentBookIndex + 1];
      nextChapter = { book_slug: nextBook.slug, chapter: 1 };
    }

    const payload: ChapterData = {
      book,
      chapter,
      total_chapters: book.chapter_count,
      active_translations: activeTranslations,
      verses,
      prev_chapter: prevChapter,
      next_chapter: nextChapter,
    };

    return NextResponse.json({
      success: true,
      data: payload,
    });
  } catch (error: any) {
    console.error('Error fetching chapter verses:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch verses' },
      { status: 500 }
    );
  }
}
