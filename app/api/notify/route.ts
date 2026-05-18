import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { chatId, portfolioName, slug } = await req.json();

    if (!chatId) return NextResponse.json({ ok: false });

    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) return NextResponse.json({ ok: false });

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      'https://portfolio-generator-tau-seven.vercel.app';
    const text = `👁 Хтось переглянув твоє портфоліо!\n\n👤 ${portfolioName}\n🔗 ${baseUrl}/p/${slug}\n\n⏰ ${new Date().toLocaleString('uk-UA')}`;

    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Notify error:', error);
    return NextResponse.json({ ok: false });
  }
}
