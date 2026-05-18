'use client';

import { useState } from 'react';
import Link from 'next/link';

interface GalleryItem {
  slug: string;
  name: string;
  title: string;
  theme: string;
  avatar: string;
  projectsCount: number;
  publishedAt: number;
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuth, setIsAuth] = useState(false);
  const [portfolios, setPortfolios] = useState<GalleryItem[]>([]);
  const [views, setViews] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadPortfolios = async (pass: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/portfolios', {
        headers: { 'x-admin-password': pass },
      });
      if (res.status === 403) {
        setError('Невірний пароль');
        setLoading(false);
        return;
      }
      const data = await res.json();
      setPortfolios(data.portfolios || []);

      const viewsData: Record<string, number> = {};
      await Promise.all(
        (data.portfolios || []).map(async (p: GalleryItem) => {
          const vRes = await fetch(`/api/views?slug=${p.slug}`);
          const v = await vRes.json();
          viewsData[p.slug] = v.views || 0;
        }),
      );
      setViews(viewsData);
      setIsAuth(true);
    } catch {
      setError('Помилка завантаження');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Видалити це портфоліо?')) return;
    const res = await fetch('/api/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, adminPassword: password }),
    });
    if (res.ok) {
      setPortfolios((prev) => prev.filter((p) => p.slug !== slug));
    } else {
      alert('Помилка видалення');
    }
  };

  const themeColors: Record<string, string> = {
    minimal: 'bg-gray-100',
    dark: 'bg-gray-900',
    creative: 'bg-gradient-to-br from-indigo-500 to-purple-600',
  };

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-sm">
          <h1 className="text-2xl font-bold text-white mb-2">
            🔐 Адмін панель
          </h1>
          <p className="text-gray-400 text-sm mb-6">Portfolio Generator</p>
          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-400 text-sm px-4 py-2 rounded-lg mb-4">
              {error}
            </div>
          )}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') loadPortfolios(password);
            }}
            placeholder="Пароль адміністратора"
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={() => loadPortfolios(password)}
            disabled={loading || !password}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-40 transition-colors"
          >
            {loading ? 'Завантаження...' : 'Увійти'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">🔐 Адмін панель</h1>
            <p className="text-sm text-gray-400">
              {portfolios.length} портфоліо в системі
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/gallery"
              className="text-sm text-gray-400 hover:text-white"
            >
              Галерея
            </Link>
            <Link href="/" className="text-sm text-gray-400 hover:text-white">
              Головна
            </Link>
            <button
              onClick={() => {
                setIsAuth(false);
                setPassword('');
                setPortfolios([]);
              }}
              className="text-sm text-red-400 hover:text-red-300"
            >
              Вийти
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800 rounded-xl p-4">
            <p className="text-3xl font-bold text-indigo-400">
              {portfolios.length}
            </p>
            <p className="text-sm text-gray-400 mt-1">Всього портфоліо</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4">
            <p className="text-3xl font-bold text-green-400">
              {Object.values(views).reduce((a, b) => a + b, 0)}
            </p>
            <p className="text-sm text-gray-400 mt-1">Всього переглядів</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4">
            <p className="text-3xl font-bold text-purple-400">
              {portfolios.filter((p) => p.theme === 'creative').length}
            </p>
            <p className="text-sm text-gray-400 mt-1">Креативна тема</p>
          </div>
        </div>

        <div className="space-y-3">
          {portfolios.map((portfolio) => (
            <div
              key={portfolio.slug}
              className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden"
            >
              <div className="flex items-center gap-4 p-4">
                <div
                  className={`w-12 h-12 rounded-lg ${themeColors[portfolio.theme] || themeColors.minimal} flex items-center justify-center shrink-0 overflow-hidden`}
                >
                  {portfolio.avatar ? (
                    <img
                      src={portfolio.avatar}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>👤</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white truncate">
                    {portfolio.name || 'Без імені'}
                  </h3>
                  <p className="text-sm text-gray-400 truncate">
                    {portfolio.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-500">
                      👁 {views[portfolio.slug] || 0} переглядів
                    </span>
                    <span className="text-xs text-gray-500">
                      📁 {portfolio.projectsCount} проєктів
                    </span>
                    <span className="text-xs text-gray-500">
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
                    className="text-xs bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Переглянути
                  </Link>
                  <button
                    onClick={() => handleDelete(portfolio.slug)}
                    className="text-xs bg-red-900/40 text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-900/60 transition-colors"
                  >
                    🗑 Видалити
                  </button>
                </div>
              </div>

              <div className="px-4 pb-3 border-t border-gray-700">
                <p className="text-xs text-gray-500 mt-2 font-mono">
                  /p/{portfolio.slug}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
