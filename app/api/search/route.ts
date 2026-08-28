import { NextRequest, NextResponse } from 'next/server';
import { searchVerses } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const translationCode = searchParams.get('translation') || undefined;
    const limit = parseInt(searchParams.get('limit') || '25', 10);

    if (!query.trim()) {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    const results = await searchVerses(query, translationCode, limit);
    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (error: any) {
    console.error('Error in search endpoint:', error);
    return NextResponse.json(
      { success: false, error: 'Search query failed' },
      { status: 500 }
    );
  }
}
