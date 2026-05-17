'use client';

import { useEffect, useState } from 'react';
import { PortfolioData } from '@/lib/types';
import { loadFromStorage } from '@/lib/storage';
import { getCompletionPercent } from '@/lib/validation';
import Link from 'next/link';

export default function StatsPage() {
  const [data, setData] = useState<PortfolioData | null>(null);

  useEffect(() => {
    setData(loadFromStorage());
  }, []);

  if (!data) return null;

  const completion = getCompletionPercent(data);

  const skillsByCategory = data.skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = 0;
      acc[skill.category]++;
      return acc;
    },
    {} as Record<string, number>,
  );

  const avgSkillLevel = data.skills.length
    ? (
        data.skills.reduce((sum, s) => sum + s.level, 0) / data.skills.length
      ).toFixed(1)
    : 0;

  const topSkill = data.skills.length
    ? data.skills.reduce((a, b) => (a.level > b.level ? a : b))
    : null;

  const allTags = data.projects.flatMap((p) => p.tags);
  const tagCount = allTags.reduce(
    (acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
  const topTags = Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const stats = [
    {
      label: 'Проєктів',
      value: data.projects.length,
      icon: '📁',
      color: 'bg-blue-50 text-blue-700',
    },
    {
      label: 'Навичок',
      value: data.skills.length,
      icon: '⚡',
      color: 'bg-yellow-50 text-yellow-700',
    },
    {
      label: 'Записів освіти',
      value: data.education.length,
      icon: '🎓',
      color: 'bg-green-50 text-green-700',
    },
    {
      label: 'Заповнено',
      value: `${completion}%`,
      icon: '✅',
      color: 'bg-indigo-50 text-indigo-700',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Статистика портфоліо
            </h1>
            <p className="text-sm text-gray-500">Аналіз введених даних</p>
          </div>
          <Link
            href="/"
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            ← Назад до редактора
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Загальна статистика */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className={`rounded-2xl p-5 ${stat.color}`}>
              <p className="text-3xl mb-1">{stat.icon}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-sm mt-1 opacity-75">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Прогрес заповнення */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Прогрес заповнення
          </h2>
          <div className="space-y-3">
            {[
              { label: "Ім'я", done: !!data.personal.name.trim() },
              { label: 'Посада', done: !!data.personal.title.trim() },
              {
                label: 'Опис (20+ символів)',
                done: data.personal.bio.trim().length >= 20,
              },
              { label: 'Email', done: !!data.contacts.email.trim() },
              { label: 'Хоча б один проєкт', done: data.projects.length > 0 },
              { label: 'Хоча б одна навичка', done: data.skills.length > 0 },
              {
                label: 'Хоча б один запис освіти',
                done: data.education.length > 0,
              },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                    item.done
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {item.done ? '✓' : '○'}
                </span>
                <span
                  className={`text-sm ${item.done ? 'text-gray-700' : 'text-gray-400'}`}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-gray-100 rounded-full h-2">
            <div
              className="bg-indigo-500 h-2 rounded-full transition-all duration-700"
              style={{ width: `${completion}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">{completion}% готовності</p>
        </div>

        {/* Навички */}
        {data.skills.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Аналіз навичок
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-3">По категоріях</p>
                <div className="space-y-2">
                  {Object.entries(skillsByCategory).map(([cat, count]) => (
                    <div key={cat} className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                        <div
                          className="bg-indigo-400 h-full rounded-full flex items-center px-3"
                          style={{
                            width: `${(count / data.skills.length) * 100}%`,
                          }}
                        >
                          <span className="text-white text-xs font-medium truncate">
                            {cat}
                          </span>
                        </div>
                      </div>
                      <span className="text-sm text-gray-600 w-4">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-indigo-50 rounded-xl p-4">
                  <p className="text-xs text-indigo-600 font-medium">
                    Середній рівень
                  </p>
                  <p className="text-2xl font-bold text-indigo-700">
                    {avgSkillLevel} / 5
                  </p>
                </div>
                {topSkill && (
                  <div className="bg-green-50 rounded-xl p-4">
                    <p className="text-xs text-green-600 font-medium">
                      Найсильніша навичка
                    </p>
                    <p className="text-lg font-bold text-green-700">
                      {topSkill.name}
                    </p>
                    <p className="text-xs text-green-500">
                      Рівень {topSkill.level} з 5
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Теги проєктів */}
        {topTags.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Топ технології в проєктах
            </h2>
            <div className="space-y-3">
              {topTags.map(([tag, count]) => (
                <div key={tag} className="flex items-center gap-3">
                  <span className="text-sm text-gray-700 w-24 truncate">
                    {tag}
                  </span>
                  <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-400 to-purple-500 h-full rounded-full"
                      style={{
                        width: `${(count / data.projects.length) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{count}x</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Теми */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Поточна тема</h2>
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-xl ${
                data.theme === 'minimal'
                  ? 'bg-gray-100 border-2 border-gray-300'
                  : data.theme === 'dark'
                    ? 'bg-gray-900'
                    : 'bg-gradient-to-br from-indigo-500 to-purple-600'
              }`}
            />
            <div>
              <p className="font-semibold text-gray-800 capitalize">
                {data.theme === 'minimal'
                  ? 'Мінімальний'
                  : data.theme === 'dark'
                    ? 'Темний'
                    : 'Креативний'}
              </p>
              <p className="text-sm text-gray-500">Обрана тема оформлення</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
