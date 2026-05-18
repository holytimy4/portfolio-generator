'use client';

import { useEffect, useState } from 'react';
import { loadMyPortfolios, MyPortfolio } from '@/lib/storage';
import Link from 'next/link';

interface PortfolioWithViews extends MyPortfolio {
  views: number;
}

const themeColors: Record<string, string> = {
  minimal: 'bg-gray-100',
  dark: 'bg-gray-900',
  creative: 'bg-gradient-to-br from-indigo-500 to-purple-600',
};

const themeNames: Record<string, string> = {
  minimal: 'Мінімальний',
  dark: 'Темний',
  creative: 'Креативний',
};

export default function MyPortfoliosPage() {
  const [portfolios, setPortfolios] = useState<PortfolioWithViews[]>([]);
  const [loading, setLoading] = useState(true);
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    setOrigin(window.location.origin);
    const loadData = async () => {
      const myPortfolios = loadMyPortfolios();
      const withViews = await Promise.all(
        myPortfolios.map(async (p) => {
          try {
            const res = await fetch(`/api/views?slug=${p.slug}`);
            const data = await res.json();
            return { ...p, views: data.views || 0 };
          } catch {
            return { ...p, views: 0 };
          }
        }),
      );
      setPortfolios(withViews);
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              👤 Мої портфоліо
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {portfolios.length} опублікованих
            </p>
          </div>
          <Link
            href="/"
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            + Створити нове
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        {loading ? (
          <div className="text-center py-24 text-gray-400">
            <p className="text-4xl mb-4">⏳</p>
            <p>Завантаження...</p>
          </div>
        ) : portfolios.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-lg">У вас ще немає опублікованих портфоліо</p>
            <Link
              href="/"
              className="inline-block mt-6 bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
            >
              Створити перше
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {portfolios.map((portfolio) => (
              <div
                key={portfolio.slug}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden"
              >
                <div className="flex items-center gap-4 p-4">
                  <div
                    className={`w-16 h-16 rounded-xl ${themeColors[portfolio.theme] || themeColors.minimal} flex items-center justify-center shrink-0 overflow-hidden`}
                  >
                    {portfolio.avatar ? (
                      <img
                        src={portfolio.avatar}
                        alt={portfolio.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl">👤</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 truncate">
                      {portfolio.name || 'Без імені'}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {portfolio.title || ''}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded">
                        {themeNames[portfolio.theme] || portfolio.theme}
                      </span>
                      <span className="text-xs text-gray-400">
                        👁 {portfolio.views} переглядів
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(portfolio.publishedAt).toLocaleDateString(
                          'uk-UA',
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/p/${portfolio.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
                    >
                      Переглянути
                    </Link>
                    <Link
                      href="/"
                      className="text-xs bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-300 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      Редагувати
                    </Link>
                  </div>
                </div>

                <div className="px-4 pb-3">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2 flex items-center gap-2">
                    <span className="text-xs text-gray-400 truncate flex-1">
                      {origin}/p/{portfolio.slug}
                    </span>
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(
                          `${origin}/p/${portfolio.slug}`,
                        )
                      }
                      className="text-xs text-indigo-500 hover:text-indigo-700 shrink-0"
                    >
                      Копіювати
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
