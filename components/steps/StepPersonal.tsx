'use client';

import { PortfolioData } from '@/lib/types';
import { ValidationErrors } from '@/lib/validation';
import { useRef, useState } from 'react';

interface Props {
  data: PortfolioData;
  onChange: (data: PortfolioData) => void;
  errors: ValidationErrors;
}

export default function StepPersonal({ data, onChange, errors }: Props) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const update = (field: string, value: string) => {
    onChange({
      ...data,
      personal: { ...data.personal, [field]: value },
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.url) {
        update('avatar', result.url);
      }
    } catch {
      alert('Помилка завантаження фото');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
        Особисті дані
      </h2>

      {/* Avatar upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Фото профілю
        </label>
        <div className="flex items-center gap-4">
          <div
            className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden cursor-pointer hover:border-indigo-400 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            {data.personal.avatar ? (
              <img
                src={data.personal.avatar}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl">👤</span>
            )}
          </div>
          <div className="space-y-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="block text-sm bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors disabled:opacity-40"
            >
              {uploading ? 'Завантаження...' : '📷 Завантажити фото'}
            </button>
            {data.personal.avatar && (
              <button
                onClick={() => update('avatar', '')}
                className="block text-sm text-red-400 hover:text-red-600"
              >
                Видалити фото
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Ім'я та прізвище *
        </label>
        <input
          type="text"
          value={data.personal.name}
          onChange={(e) => update('name', e.target.value)}
          placeholder="Іван Петренко"
          className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-900 dark:text-gray-100 ${
            errors.name
              ? 'border-red-400 bg-red-50'
              : 'border-gray-300 dark:border-gray-600'
          }`}
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Посада / спеціальність *
        </label>
        <input
          type="text"
          value={data.personal.title}
          onChange={(e) => update('title', e.target.value)}
          placeholder="Frontend Developer"
          className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-900 dark:text-gray-100 ${
            errors.title
              ? 'border-red-400 bg-red-50'
              : 'border-gray-300 dark:border-gray-600'
          }`}
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Про себе *
        </label>
        <textarea
          value={data.personal.bio}
          onChange={(e) => update('bio', e.target.value)}
          placeholder="Короткий опис — хто ви, чим займаєтесь, що вас цікавить..."
          rows={5}
          className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none dark:bg-gray-900 dark:text-gray-100 ${
            errors.bio
              ? 'border-red-400 bg-red-50'
              : 'border-gray-300 dark:border-gray-600'
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
