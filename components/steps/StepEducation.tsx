'use client';

import { PortfolioData, Education } from '@/lib/types';
import { ValidationErrors } from '@/lib/validation';

interface Props {
  data: PortfolioData;
  onChange: (data: PortfolioData) => void;
  errors: ValidationErrors;
}

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

export default function StepEducation({ data, onChange, errors }: Props) {
  const addEducation = () => {
    const newEducation: Education = {
      id: generateId(),
      degree: '',
      school: '',
      year: '',
      description: '',
    };
    onChange({ ...data, education: [...data.education, newEducation] });
  };

  const updateEducation = (id: string, field: string, value: string) => {
    onChange({
      ...data,
      education: data.education.map((e) =>
        e.id === id ? { ...e, [field]: value } : e,
      ),
    });
  };

  const removeEducation = (id: string) => {
    onChange({ ...data, education: data.education.filter((e) => e.id !== id) });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Освіта</h2>

      {data.education.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p className="text-4xl mb-3">🎓</p>
          <p className="text-sm">Додайте інформацію про освіту</p>
          <p className="text-xs mt-1">Університет, курси, сертифікати</p>
        </div>
      )}

      {data.education.map((edu, index) => {
        const eduErrors = errors.education?.[edu.id] || {};
        return (
          <div
            key={edu.id}
            className="border border-gray-200 rounded-xl p-5 space-y-4 bg-gray-50"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-700">
                Запис #{index + 1}
              </h3>
              <button
                onClick={() => removeEducation(edu.id)}
                className="text-red-400 hover:text-red-600 text-sm transition-colors"
              >
                Видалити
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Спеціальність / назва курсу *
              </label>
              <input
                type="text"
                value={edu.degree}
                onChange={(e) =>
                  updateEducation(edu.id, 'degree', e.target.value)
                }
                placeholder="Комп'ютерна інженерія"
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  eduErrors.degree
                    ? 'border-red-400 bg-red-50'
                    : 'border-gray-300'
                }`}
              />
              {eduErrors.degree && (
                <p className="text-red-500 text-xs mt-1">{eduErrors.degree}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Заклад *
                </label>
                <input
                  type="text"
                  value={edu.school}
                  onChange={(e) =>
                    updateEducation(edu.id, 'school', e.target.value)
                  }
                  placeholder="КПІ ім. Сікорського"
                  className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    eduErrors.school
                      ? 'border-red-400 bg-red-50'
                      : 'border-gray-300'
                  }`}
                />
                {eduErrors.school && (
                  <p className="text-red-500 text-xs mt-1">
                    {eduErrors.school}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Рік закінчення
                </label>
                <input
                  type="text"
                  value={edu.year}
                  onChange={(e) =>
                    updateEducation(edu.id, 'year', e.target.value)
                  }
                  placeholder="2024"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Опис{' '}
                <span className="text-gray-400 font-normal">
                  (необов'язково)
                </span>
              </label>
              <textarea
                value={edu.description}
                onChange={(e) =>
                  updateEducation(edu.id, 'description', e.target.value)
                }
                placeholder="Дипломна робота, досягнення, спеціалізація..."
                rows={2}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>
          </div>
        );
      })}

      <button
        onClick={addEducation}
        className="w-full border-2 border-dashed border-indigo-300 rounded-xl py-3 text-indigo-500 hover:border-indigo-500 hover:text-indigo-700 transition-colors font-medium"
      >
        + Додати запис
      </button>
    </div>
  );
}
