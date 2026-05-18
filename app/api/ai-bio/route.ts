import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { name, title, skills, projects } = await req.json();

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 300,
      messages: [
        {
          role: 'user',
          content: `Напиши короткий професійний опис (bio) для портфоліо українською мовою.

Дані:
- Ім'я: ${name}
- Посада: ${title}
- Навички: ${skills?.join(', ') || 'не вказано'}
- Проєкти: ${projects?.map((p: { title: string }) => p.title).join(', ') || 'не вказано'}

Вимоги:
- 3-4 речення
- Професійний але живий тон
- Без кліше
- Тільки сам текст без пояснень і лапок`,
        },
      ],
    });

    const text = completion.choices[0]?.message?.content || '';
    return NextResponse.json({ bio: text });
  } catch (error) {
    console.error('AI bio error:', error);
    return NextResponse.json(
      { error: 'Failed to generate bio' },
      { status: 500 },
    );
  }
}
