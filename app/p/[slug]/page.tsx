import { Redis } from '@upstash/redis';
import { generateHTML } from '@/lib/templates';
import { PortfolioData } from '@/lib/types';
import { notFound } from 'next/navigation';

const redis = Redis.fromEnv();

export default async function PublicPortfolioPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let raw;
  try {
    raw = await redis.get(`portfolio:${slug}`);
  } catch (e) {
    console.error('Redis error:', e);
    return notFound();
  }

  if (!raw) return notFound();

  // Збільшуємо лічильник переглядів
  await redis.incr(`views:${slug}`);
  const views = (await redis.get(`views:${slug}`)) as number;

  const data =
    typeof raw === 'string' ? JSON.parse(raw) : (raw as PortfolioData);
  const html = generateHTML(data);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
