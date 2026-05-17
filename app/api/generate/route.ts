import { NextRequest, NextResponse } from 'next/server';
import { generateHTML } from '@/lib/templates';
import { PortfolioData } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const data: PortfolioData = await req.json();
    const html = generateHTML(data);

    const encoder = new TextEncoder();
    const encoded = encoder.encode(html);

    return new NextResponse(encoded, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `attachment; filename="portfolio.html"`,
      },
    });
  } catch (error) {
    console.error('Generate error:', error);
    return NextResponse.json(
      { error: 'Failed to generate portfolio' },
      { status: 500 },
    );
  }
}
