import { NextRequest, NextResponse } from 'next/server';
import { savePushSubscription } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { endpoint, keys, userId } = body;

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return NextResponse.json(
        { success: false, error: 'Invalid push subscription payload: endpoint and keys required' },
        { status: 400 }
      );
    }

    await savePushSubscription(endpoint, keys.p256dh, keys.auth, userId || null);

    return NextResponse.json({
      success: true,
      message: 'Push subscription stored successfully',
    });
  } catch (error: any) {
    console.error('Error saving push subscription:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save push subscription' },
      { status: 500 }
    );
  }
}
