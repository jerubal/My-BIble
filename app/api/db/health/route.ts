import { NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = getDbPool();

  if (!db) {
    return NextResponse.json({
      status: 'offline',
      connected: false,
      message: 'No DATABASE_URL or POSTGRES_URL configured. App is running in autonomous zero-dependency mode using verified seed & disk datasets.',
      environment_variables_supported: [
        'DATABASE_URL',
        'POSTGRES_URL',
        'POSTGRES_PRISMA_URL',
        'POSTGRES_URL_NON_POOLING',
        'SUPABASE_DB_URL',
        'NEON_DATABASE_URL',
      ],
      timestamp: new Date().toISOString(),
    });
  }

  const startTime = Date.now();
  try {
    const pingRes = await db.query('SELECT NOW() as server_time, version() as pg_version');
    const latencyMs = Date.now() - startTime;

    // Fetch table stats if tables exist
    let tableStats: Record<string, number> = {};
    try {
      const statsRes = await db.query(`
        SELECT 
          (SELECT COUNT(*) FROM translations) AS translations_count,
          (SELECT COUNT(*) FROM books) AS books_count,
          (SELECT COUNT(*) FROM verses) AS verses_count,
          (SELECT COUNT(*) FROM daily_verses) AS daily_verses_count,
          (SELECT COUNT(*) FROM bookmarks) AS bookmarks_count,
          (SELECT COUNT(*) FROM highlights) AS highlights_count
      `);
      if (statsRes.rows.length > 0) {
        tableStats = statsRes.rows[0];
      }
    } catch (tblErr: any) {
      tableStats = { note: 'Tables not yet initialized. Run npm run db:seed to create schema and ingest full canon.' } as any;
    }

    return NextResponse.json({
      status: 'online',
      connected: true,
      latency_ms: latencyMs,
      server_time: pingRes.rows[0]?.server_time,
      pg_version: pingRes.rows[0]?.pg_version?.split(' ')[0] + ' ' + pingRes.rows[0]?.pg_version?.split(' ')[1],
      tables: tableStats,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        status: 'error',
        connected: false,
        error: err.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
