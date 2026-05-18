'use client';

import { PortfolioData } from '@/lib/types';
import { ValidationErrors } from '@/lib/validation';
import { useRef } from 'react';

interface Props {
  data: PortfolioData;
  onChange: (data: PortfolioData) => void;
  errors: ValidationErrors;
}

export default function StepContacts({ data, onChange, errors }: Props) {
  const chatIdInputRef = useRef<HTMLInputElement>(null);

  const update = (field: string, value: string) => {
    onChange({
      ...data,
      contacts: { ...data.contacts, [field]: value },
    });
  };

  const saveChatId = () => {
    const val = chatIdInputRef.current?.value.trim();
    if (val) update('telegramChatId', val);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
        Контакти
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email *
        </label>
        <input
          type="email"
          value={data.contacts.email}
          onChange={(e) => update('email', e.target.value)}
          placeholder="ivan@example.com"
          className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-900 dark:text-gray-100 ${
            errors.email
              ? 'border-red-400 bg-red-50'
              : 'border-gray-300 dark:border-gray-600'
          }`}
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          GitHub{' '}
          <span className="text-gray-400 font-normal">(тільки username)</span>
        </label>
        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
          <span className="bg-gray-100 dark:bg-gray-700 px-3 py-2 text-gray-500 dark:text-gray-400 text-sm border-r border-gray-300 dark:border-gray-600">
            github.com/
          </span>
          <input
            type="text"
            value={data.contacts.github}
            onChange={(e) => update('github', e.target.value)}
            placeholder="username"
            className="flex-1 px-4 py-2 focus:outline-none dark:bg-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          LinkedIn{' '}
          <span className="text-gray-400 font-normal">(тільки username)</span>
        </label>
        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
          <span className="bg-gray-100 dark:bg-gray-700 px-3 py-2 text-gray-500 dark:text-gray-400 text-sm border-r border-gray-300 dark:border-gray-600">
            linkedin.com/in/
          </span>
          <input
            type="text"
            value={data.contacts.linkedin}
            onChange={(e) => update('linkedin', e.target.value)}
            placeholder="username"
            className="flex-1 px-4 py-2 focus:outline-none dark:bg-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Telegram{' '}
          <span className="text-gray-400 font-normal">(тільки username)</span>
        </label>
        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
          <span className="bg-gray-100 dark:bg-gray-700 px-3 py-2 text-gray-500 dark:text-gray-400 text-sm border-r border-gray-300 dark:border-gray-600">
            t.me/
          </span>
          <input
            type="text"
            value={data.contacts.telegram}
            onChange={(e) => update('telegram', e.target.value)}
            placeholder="username"
            className="flex-1 px-4 py-2 focus:outline-none dark:bg-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Сповіщення в Telegram{' '}
          <span className="text-gray-400 font-normal">(необов`язково)</span>
        </label>

        {data.contacts.telegramChatId ? (
          <div className="border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-400">
                  Telegram підключено
                </p>
                <p className="text-xs text-green-600 dark:text-green-500">
                  Chat ID: {data.contacts.telegramChatId}
                </p>
              </div>
            </div>
            <button
              onClick={() => update('telegramChatId', '')}
              className="text-xs text-red-400 hover:text-red-600 transition-colors"
            >
              Відключити
            </button>
          </div>
        ) : (
          <div className="border border-gray-200 dark:border-gray-600 rounded-xl p-4 space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Отримуйте сповіщення коли хтось переглядає ваше портфоліо
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <a
                href="https://t.me/Portfoliokpi_Bot"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                ✈ Відкрити бота
              </a>
              <span className="text-xs text-gray-400">
                → напишіть /start → скопіюйте ID
              </span>
            </div>
            <div className="flex gap-2">
              <input
                ref={chatIdInputRef}
                type="text"
                placeholder="Вставте ваш Chat ID"
                className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-900 dark:text-gray-100"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveChatId();
                }}
              />
              <button
                onClick={saveChatId}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors"
              >
                Зберегти
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4">
        <p className="text-sm text-blue-700 dark:text-blue-400 font-medium mb-1">
          💡 Порада
        </p>
        <p className="text-xs text-blue-600 dark:text-blue-500">
          GitHub і LinkedIn значно підвищують довіру до портфоліо. Рекомендуємо
          заповнити хоча б одне з них.
        </p>
      </div>
    </div>
  );
}
