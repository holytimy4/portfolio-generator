import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = body.message;
    if (!message) return NextResponse.json({ ok: true });

    const chatId = message.chat.id;
    const text = message.text;
    const token = process.env.TELEGRAM_BOT_TOKEN;

    if (text === '/start' || text === '/id') {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: `👋 Привіт!\n\nТвій Telegram Chat ID:\n\`${chatId}\`\n\nСкопіюй це число і встав у поле "Сповіщення в Telegram" в Portfolio Generator щоб отримувати сповіщення про перегляди!`,
          parse_mode: 'Markdown',
        }),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ ok: true });
  }
}
