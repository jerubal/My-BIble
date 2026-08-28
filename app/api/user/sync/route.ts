import { NextRequest, NextResponse } from 'next/server';
import {
  getUserBookmarks,
  saveUserBookmark,
  deleteUserBookmark,
  getUserHighlights,
  saveUserHighlight,
  getUserReadingProgress,
  saveUserReadingProgress,
  getDbPool,
} from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId query parameter is required' }, { status: 400 });
  }

  const db = getDbPool();
  if (!db) {
    return NextResponse.json({
      db_connected: false,
      message: 'Postgres DB not connected. Data stored locally on client.',
      bookmarks: [],
      highlights: [],
      reading_progress: [],
    });
  }

  try {
    const [bookmarks, highlights, readingProgress] = await Promise.all([
      getUserBookmarks(userId),
      getUserHighlights(userId),
      getUserReadingProgress(userId),
    ]);

    return NextResponse.json({
      db_connected: true,
      bookmarks,
      highlights,
      reading_progress: readingProgress,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, type, action, data } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ error: 'Missing required fields (userId, type, data)' }, { status: 400 });
    }

    const db = getDbPool();
    if (!db) {
      return NextResponse.json({
        db_connected: false,
        synced: false,
        message: 'Postgres DB not connected. Saved to browser storage.',
      });
    }

    if (type === 'bookmark') {
      if (action === 'delete') {
        await deleteUserBookmark(userId, data.book_slug, data.chapter, data.verse_num);
      } else {
        await saveUserBookmark(userId, data.book_slug, data.chapter, data.verse_num);
      }
    } else if (type === 'highlight') {
      await saveUserHighlight(userId, data.book_slug, data.chapter, data.verse_num, data.color, data.note);
    } else if (type === 'progress') {
      await saveUserReadingProgress(userId, data.book_slug, data.chapter);
    }

    return NextResponse.json({ success: true, db_connected: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
