import { Redis } from '@upstash/redis';
import Link from 'next/link';

const redis = Redis.fromEnv();

interface GalleryItem {
  slug: string;
  name: string;
  title: string;
  theme: string;
  avatar: string;
  projectsCount: number;
  publishedAt: number;
}

export const revalidate = 60;

export default async function GalleryPage() {
  let items: GalleryItem[] = [];

  try {
    const raw = await redis.lrange('gallery', 0, 49);
    items = raw.map((item) =>
      typeof item === 'string' ? JSON.parse(item) : item,
    );
  } catch (e) {
    console.error('Gallery error:', e);
  }

  const themeColors: Record<string, string> = {
    minimal: 'bg-gray-100 border-gray-200',
    dark: 'bg-gray-900 border-gray-700',
    creative:
      'bg-gradient-to-br from-indigo-500 to-purple-600 border-indigo-300',
  };

  const themeNames: Record<string, string> = {
    minimal: 'Мінімальний',
    dark: 'Темний',
    creative: 'Креативний',
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              🌐 Галерея портфоліо
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {items.length} опублікованих портфоліо
            </p>
          </div>
          <Link
            href="/"
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            + Створити своє
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {items.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-lg">Поки немає опублікованих портфоліо</p>
            <p className="text-sm mt-2">Будьте першим!</p>
            <Link
              href="/"
              className="inline-block mt-6 bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
            >
              Створити портфоліо
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <Link
                key={item.slug}
                href={`/p/${item.slug}`}
                target="_blank"
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
              >
                <div
                  className={`h-24 ${themeColors[item.theme] || themeColors.minimal} flex items-center px-6 gap-4`}
                >
                  {item.avatar ? (
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white/50"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl">
                      👤
                    </div>
                  )}
                  <div>
                    <p
                      className={`font-bold text-lg ${item.theme === 'minimal' ? 'text-gray-900' : 'text-white'}`}
                    >
                      {item.name || 'Без імені'}
                    </p>
                    <p
                      className={`text-sm ${item.theme === 'minimal' ? 'text-gray-500' : 'text-white/70'}`}
                    >
                      {item.title || ''}
                    </p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>📁 {item.projectsCount} проєктів</span>
                    <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-xs">
                      {themeNames[item.theme] || item.theme}
                    </span>
                  </div>
                  <div className="mt-3 text-indigo-600 dark:text-indigo-400 text-sm font-medium group-hover:underline">
                    Переглянути →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
