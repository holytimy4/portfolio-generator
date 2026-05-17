'use client';

import { PortfolioData, Experience } from '@/lib/types';
import { ValidationErrors } from '@/lib/validation';

interface Props {
  data: PortfolioData;
  onChange: (data: PortfolioData) => void;
  errors: ValidationErrors;
}

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

export default function StepExperience({ data, onChange, errors }: Props) {
  const addExperience = () => {
    const newExp: Experience = {
      id: generateId(),
      position: '',
      company: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    };
    onChange({ ...data, experience: [...data.experience, newExp] });
  };

  const updateExperience = (
    id: string,
    field: string,
    value: string | boolean,
  ) => {
    onChange({
      ...data,
      experience: data.experience.map((e) =>
        e.id === id ? { ...e, [field]: value } : e,
      ),
    });
  };

  const removeExperience = (id: string) => {
    onChange({
      ...data,
      experience: data.experience.filter((e) => e.id !== id),
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
        Досвід роботи
      </h2>

      {data.experience.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p className="text-4xl mb-3">💼</p>
          <p className="text-sm">Додайте досвід роботи</p>
          <p className="text-xs mt-1">
            Попередні місця роботи, стажування, фріланс
          </p>
        </div>
      )}

      {data.experience.map((exp, index) => (
        <div
          key={exp.id}
          className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 space-y-4 bg-gray-50 dark:bg-gray-800"
        >
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">
              Місце #{index + 1}
            </h3>
            <button
              onClick={() => removeExperience(exp.id)}
              className="text-red-400 hover:text-red-600 text-sm transition-colors"
            >
              Видалити
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Посада *
            </label>
            <input
              type="text"
              value={exp.position}
              onChange={(e) =>
                updateExperience(exp.id, 'position', e.target.value)
              }
              placeholder="Frontend Developer"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Компанія *
            </label>
            <input
              type="text"
              value={exp.company}
              onChange={(e) =>
                updateExperience(exp.id, 'company', e.target.value)
              }
              placeholder="Google"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Початок
              </label>
              <input
                type="month"
                value={exp.startDate}
                onChange={(e) =>
                  updateExperience(exp.id, 'startDate', e.target.value)
                }
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Кінець
              </label>
              <input
                type="month"
                value={exp.endDate}
                onChange={(e) =>
                  updateExperience(exp.id, 'endDate', e.target.value)
                }
                disabled={exp.current}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-900 dark:text-gray-100 disabled:opacity-40"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`current-${exp.id}`}
              checked={exp.current}
              onChange={(e) =>
                updateExperience(exp.id, 'current', e.target.checked)
              }
              className="w-4 h-4 accent-indigo-600"
            />
            <label
              htmlFor={`current-${exp.id}`}
              className="text-sm text-gray-700 dark:text-gray-300"
            >
              Працюю тут зараз
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Опис обов'язків
            </label>
            <textarea
              value={exp.description}
              onChange={(e) =>
                updateExperience(exp.id, 'description', e.target.value)
              }
              placeholder="Що ви робили, яких результатів досягли..."
              rows={3}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none dark:bg-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
      ))}

      <button
        onClick={addExperience}
        className="w-full border-2 border-dashed border-indigo-300 rounded-xl py-3 text-indigo-500 hover:border-indigo-500 hover:text-indigo-700 transition-colors font-medium"
      >
        + Додати місце роботи
      </button>
    </div>
  );
}
