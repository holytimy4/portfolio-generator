import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export async function POST(req: NextRequest) {
  try {
    const { slug, editToken, adminPassword } = await req.json();

    if (!slug) return NextResponse.json({ error: 'No slug' }, { status: 400 });

    // Адмін може видаляти без токену
    if (adminPassword) {
      if (adminPassword !== ADMIN_PASSWORD) {
        return NextResponse.json(
          { error: 'Invalid admin password' },
          { status: 403 },
        );
      }
    } else {
      // Звичайний юзер — перевіряємо токен
      if (!editToken)
        return NextResponse.json({ error: 'No token' }, { status: 400 });
      const savedToken = await redis.get(`token:${slug}`);
      if (savedToken !== editToken) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
      }
    }

    // Видаляємо портфоліо
    await redis.del(`portfolio:${slug}`);
    await redis.del(`token:${slug}`);
    await redis.del(`views:${slug}`);

    // Видаляємо з галереї
    const allItems = await redis.lrange('gallery', 0, 49);
    const filtered = allItems.filter((item) => {
      const parsed = typeof item === 'string' ? JSON.parse(item) : item;
      return parsed.slug !== slug;
    });
    await redis.del('gallery');
    if (filtered.length > 0) {
      await redis.rpush('gallery', ...(filtered as string[]));
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
