'use client';

import { PortfolioData } from '@/lib/types';
import { ValidationErrors } from '@/lib/validation';

interface Props {
  data: PortfolioData;
  onChange: (data: PortfolioData) => void;
  errors: ValidationErrors;
}

export default function StepPersonal({ data, onChange, errors }: Props) {
  const update = (field: string, value: string) => {
    onChange({
      ...data,
      personal: { ...data.personal, [field]: value },
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Особисті дані</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ім'я та прізвище *
        </label>
        <input
          type="text"
          value={data.personal.name}
          onChange={(e) => update('name', e.target.value)}
          placeholder="Іван Петренко"
          className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.name ? 'border-red-400 bg-red-50' : 'border-gray-300'
          }`}
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Посада / спеціальність *
        </label>
        <input
          type="text"
          value={data.personal.title}
          onChange={(e) => update('title', e.target.value)}
          placeholder="Frontend Developer"
          className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.title ? 'border-red-400 bg-red-50' : 'border-gray-300'
          }`}
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Про себе *
        </label>
        <textarea
          value={data.personal.bio}
          onChange={(e) => update('bio', e.target.value)}
          placeholder="Короткий опис — хто ви, чим займаєтесь, що вас цікавить..."
          rows={5}
          className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none ${
            errors.bio ? 'border-red-400 bg-red-50' : 'border-gray-300'
          }`}
        />
        <div className="flex justify-between mt-1">
          {errors.bio ? (
            <p className="text-red-500 text-xs">{errors.bio}</p>
          ) : (
            <span />
          )}
          <span className="text-xs text-gray-400">
            {data.personal.bio.length} символів
          </span>
        </div>
      </div>
    </div>
  );
}
