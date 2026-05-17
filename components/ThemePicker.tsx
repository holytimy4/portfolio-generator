'use client';

import { PortfolioData } from '@/lib/types';
import { useEffect, useState } from 'react';

interface Props {
  data: PortfolioData;
  onChange: (data: PortfolioData) => void;
}

const themes = [
  {
    id: 'minimal',
    name: 'Мінімальний',
    description: 'Чистий, типографічний стиль',
    preview: 'bg-white border-2 border-gray-200',
    accent: 'bg-gray-800',
  },
  {
    id: 'dark',
    name: 'Темний',
    description: 'Темний фон, зелені акценти',
    preview: 'bg-gray-900 border-2 border-gray-700',
    accent: 'bg-green-400',
  },
  {
    id: 'creative',
    name: 'Креативний',
    description: 'Фіолетовий градієнт, картки',
    preview:
      'bg-gradient-to-br from-indigo-500 to-purple-600 border-2 border-indigo-300',
    accent: 'bg-white',
  },
];

export default function ThemePicker({ data, onChange }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700">Тема оформлення</h3>
      <div className="grid grid-cols-3 gap-3">
        {themes.map((theme) => {
          const isActive = mounted && data.theme === theme.id;
          return (
            <button
              key={theme.id}
              onClick={() =>
                onChange({ ...data, theme: theme.id as PortfolioData['theme'] })
              }
              className={`relative rounded-xl p-3 text-left transition-all ${
                isActive
                  ? 'ring-2 ring-indigo-500 ring-offset-2'
                  : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-2'
              }`}
            >
              <div
                className={`h-16 rounded-lg mb-2 ${theme.preview} flex items-end p-2`}
              >
                <div className={`h-2 w-8 rounded ${theme.accent}`} />
              </div>
              <p className="text-xs font-semibold text-gray-800">
                {theme.name}
              </p>
              <p className="text-xs text-gray-500">{theme.description}</p>
              {isActive && (
                <div className="absolute top-2 right-2 bg-indigo-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  ✓
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
