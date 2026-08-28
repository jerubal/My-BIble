import { NextRequest, NextResponse } from 'next/server';
import { getDailyVerse } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');
    const todayStr = dateParam || new Date().toISOString().split('T')[0];

    const daily = await getDailyVerse(todayStr);
    return NextResponse.json({
      success: true,
      data: daily,
    });
  } catch (error: any) {
    console.error('Error fetching daily verse:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch daily verse' },
      { status: 500 }
    );
  }
}
