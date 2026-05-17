'use client';

import { PortfolioData } from '@/lib/types';
import { ValidationErrors } from '@/lib/validation';

interface Props {
  data: PortfolioData;
  onChange: (data: PortfolioData) => void;
  errors: ValidationErrors;
}

export default function StepContacts({ data, onChange, errors }: Props) {
  const update = (field: string, value: string) => {
    onChange({
      ...data,
      contacts: { ...data.contacts, [field]: value },
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Контакти</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email *
        </label>
        <input
          type="email"
          value={data.contacts.email}
          onChange={(e) => update('email', e.target.value)}
          placeholder="ivan@example.com"
          className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.email ? 'border-red-400 bg-red-50' : 'border-gray-300'
          }`}
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          GitHub{' '}
          <span className="text-gray-400 font-normal">(тільки username)</span>
        </label>
        <div
          className={`flex items-center border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 ${'border-gray-300'}`}
        >
          <span className="bg-gray-100 px-3 py-2 text-gray-500 text-sm border-r border-gray-300">
            github.com/
          </span>
          <input
            type="text"
            value={data.contacts.github}
            onChange={(e) => update('github', e.target.value)}
            placeholder="username"
            className="flex-1 px-4 py-2 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          LinkedIn{' '}
          <span className="text-gray-400 font-normal">(тільки username)</span>
        </label>
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
          <span className="bg-gray-100 px-3 py-2 text-gray-500 text-sm border-r border-gray-300">
            linkedin.com/in/
          </span>
          <input
            type="text"
            value={data.contacts.linkedin}
            onChange={(e) => update('linkedin', e.target.value)}
            placeholder="username"
            className="flex-1 px-4 py-2 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Telegram{' '}
          <span className="text-gray-400 font-normal">(тільки username)</span>
        </label>
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
          <span className="bg-gray-100 px-3 py-2 text-gray-500 text-sm border-r border-gray-300">
            t.me/
          </span>
          <input
            type="text"
            value={data.contacts.telegram}
            onChange={(e) => update('telegram', e.target.value)}
            placeholder="username"
            className="flex-1 px-4 py-2 focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <p className="text-sm text-blue-700 font-medium mb-1">💡 Порада</p>
        <p className="text-xs text-blue-600">
          GitHub і LinkedIn значно підвищують довіру до портфоліо. Рекомендуємо
          заповнити хоча б одне з них.
        </p>
      </div>
    </div>
  );
}
