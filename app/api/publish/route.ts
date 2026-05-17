import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { PortfolioData } from '@/lib/types';

const redis = Redis.fromEnv();

const CYRILLIC_MAP: Record<string, string> = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'h',
  ґ: 'g',
  д: 'd',
  е: 'e',
  є: 'ye',
  ж: 'zh',
  з: 'z',
  и: 'y',
  і: 'i',
  ї: 'yi',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'kh',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'shch',
  ь: '',
  ю: 'yu',
  я: 'ya',
  э: 'e',
  ё: 'yo',
  ъ: '',
  ы: 'y',
};

function transliterate(text: string): string {
  return text
    .toLowerCase()
    .split('')
    .map((char) => CYRILLIC_MAP[char] ?? char)
    .join('');
}

function generateSlug(name: string): string {
  const transliterated = transliterate(name);
  const clean = transliterated
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 30);
  const suffix = Math.random().toString(36).substring(2, 7);
  return clean ? `${clean}-${suffix}` : `portfolio-${suffix}`;
}

export async function POST(req: NextRequest) {
  try {
    const {
      data,
      editToken,
      slug: existingSlug,
    } = (await req.json()) as {
      data: PortfolioData;
      editToken?: string;
      slug?: string;
    };

    let slug = existingSlug;

    if (editToken && existingSlug) {
      const savedToken = await redis.get(`token:${existingSlug}`);
      if (savedToken !== editToken) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
      }

      await redis.set(`portfolio:${existingSlug}`, JSON.stringify(data), {
        ex: 60 * 60 * 24 * 30,
      });

      // Оновлюємо в галереї
      const allItems = await redis.lrange('gallery', 0, 49);
      const updatedItems = allItems.map((item) => {
        const parsed = typeof item === 'string' ? JSON.parse(item) : item;
        if (parsed.slug === existingSlug) {
          return JSON.stringify({
            ...parsed,
            name: data.personal.name,
            title: data.personal.title,
            theme: data.theme,
            avatar: data.personal.avatar || '',
            projectsCount: data.projects.length,
          });
        }
        return typeof item === 'string' ? item : JSON.stringify(item);
      });

      await redis.del('gallery');
      if (updatedItems.length > 0) {
        await redis.rpush('gallery', ...(updatedItems as string[]));
      }

      return NextResponse.json({
        slug: existingSlug,
        url: `/p/${existingSlug}`,
      });
    }

    // Створюємо нове
    slug = generateSlug(data.personal.name || 'portfolio');
    const newToken =
      Math.random().toString(36).substring(2) +
      Math.random().toString(36).substring(2);

    await redis.set(`portfolio:${slug}`, JSON.stringify(data), {
      ex: 60 * 60 * 24 * 30,
    });
    await redis.set(`token:${slug}`, newToken, {
      ex: 60 * 60 * 24 * 30,
    });

    const galleryItem = {
      slug,
      name: data.personal.name,
      title: data.personal.title,
      theme: data.theme,
      avatar: data.personal.avatar || '',
      projectsCount: data.projects.length,
      publishedAt: Date.now(),
    };
    await redis.lpush('gallery', JSON.stringify(galleryItem));
    await redis.ltrim('gallery', 0, 49);

    return NextResponse.json({ slug, url: `/p/${slug}`, editToken: newToken });
  } catch (error) {
    console.error('Publish error:', error);
    return NextResponse.json({ error: 'Failed to publish' }, { status: 500 });
  }
}
