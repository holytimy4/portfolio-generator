import { Redis } from '@upstash/redis';
import { generateHTML } from '@/lib/templates';
import { PortfolioData } from '@/lib/types';
import { notFound } from 'next/navigation';

const redis = Redis.fromEnv();

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  'https://portfolio-generator-tau-seven.vercel.app';

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

  await redis.incr(`views:${slug}`);

  const data =
    typeof raw === 'string' ? JSON.parse(raw) : (raw as PortfolioData);

  if (data.contacts?.telegramChatId) {
    fetch(`${BASE_URL}/api/notify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chatId: data.contacts.telegramChatId,
        portfolioName: data.personal?.name || 'Портфоліо',
        slug,
      }),
    }).catch(console.error);
  }

  const html = generateHTML(data);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
