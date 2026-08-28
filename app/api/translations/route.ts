import { NextResponse } from 'next/server';
import { getTranslations } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const translations = await getTranslations();
    return NextResponse.json({
      success: true,
      data: translations,
    });
  } catch (error: any) {
    console.error('Error fetching translations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch translations' },
      { status: 500 }
    );
  }
}
