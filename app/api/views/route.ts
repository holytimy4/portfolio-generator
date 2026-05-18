import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export async function GET(req: NextRequest) {
  try {
    const slug = req.nextUrl.searchParams.get('slug');
    if (!slug) {
      return NextResponse.json({ error: 'No slug' }, { status: 400 });
    }
    const views = (await redis.get(`views:${slug}`)) as number | null;
    return NextResponse.json({ views: views || 0 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get views' }, { status: 500 });
  }
}
