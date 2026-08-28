import { NextResponse } from 'next/server';
import { getBooks } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const books = await getBooks();
    return NextResponse.json({
      success: true,
      data: books,
    });
  } catch (error: any) {
    console.error('Error fetching books:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch books' },
      { status: 500 }
    );
  }
}
