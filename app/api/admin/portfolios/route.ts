import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export async function GET(req: NextRequest) {
  const password = req.headers.get('x-admin-password');
  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const raw = await redis.lrange('gallery', 0, 99);
    const portfolios = raw.map((item) =>
      typeof item === 'string' ? JSON.parse(item) : item,
    );
    return NextResponse.json({ portfolios });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load' }, { status: 500 });
  }
}
