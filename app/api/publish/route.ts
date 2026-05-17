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
    const data: PortfolioData = await req.json();
    const slug = generateSlug(data.personal.name || 'portfolio');

    await redis.set(`portfolio:${slug}`, JSON.stringify(data), {
      ex: 60 * 60 * 24 * 30,
    });

    return NextResponse.json({ slug, url: `/p/${slug}` });
  } catch (error) {
    console.error('Publish error:', error);
    return NextResponse.json({ error: 'Failed to publish' }, { status: 500 });
  }
}
