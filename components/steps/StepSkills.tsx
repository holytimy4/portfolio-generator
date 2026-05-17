'use client';

import { useState } from 'react';
import { PortfolioData, Skill } from '@/lib/types';
import { ValidationErrors } from '@/lib/validation';

interface Props {
  data: PortfolioData;
  onChange: (data: PortfolioData) => void;
  errors: ValidationErrors;
}

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

const categories = [
  'Frontend',
  'Backend',
  'Database',
  'DevOps',
  'Design',
  'Other',
];

const levelLabels = [
  '',
  'Початківець',
  'Базовий',
  'Середній',
  'Просунутий',
  'Експерт',
];

export default function StepSkills({ data, onChange, errors }: Props) {
  const addSkill = () => {
    const newSkill: Skill = {
      id: generateId(),
      name: '',
      level: 3,
      category: 'Frontend',
    };
    onChange({ ...data, skills: [...data.skills, newSkill] });
  };

  const updateSkill = (id: string, field: string, value: string | number) => {
    onChange({
      ...data,
      skills: data.skills.map((s) =>
        s.id === id ? { ...s, [field]: value } : s,
      ),
    });
  };

  const removeSkill = (id: string) => {
    onChange({ ...data, skills: data.skills.filter((s) => s.id !== id) });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Навички</h2>

      {data.skills.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p className="text-4xl mb-3">⚡</p>
          <p className="text-sm">Додайте свої технічні навички</p>
          <p className="text-xs mt-1">
            Вкажіть рівень володіння кожною технологією
          </p>
        </div>
      )}

      {data.skills.map((skill, index) => {
        const skillErrors = errors.skills?.[skill.id] || {};
        return (
          <div
            key={skill.id}
            className="border border-gray-200 rounded-xl p-5 space-y-4 bg-gray-50"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-700">
                Навичка #{index + 1}
              </h3>
              <button
                onClick={() => removeSkill(skill.id)}
                className="text-red-400 hover:text-red-600 text-sm transition-colors"
              >
                Видалити
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Назва *
                </label>
                <input
                  type="text"
                  value={skill.name}
                  onChange={(e) =>
                    updateSkill(skill.id, 'name', e.target.value)
                  }
                  placeholder="React"
                  className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    skillErrors.name
                      ? 'border-red-400 bg-red-50'
                      : 'border-gray-300'
                  }`}
                />
                {skillErrors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {skillErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Категорія
                </label>
                <select
                  value={skill.category}
                  onChange={(e) =>
                    updateSkill(skill.id, 'category', e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Рівень:{' '}
                <span className="text-indigo-600">
                  {levelLabels[skill.level]}
                </span>
              </label>
              <input
                type="range"
                min={1}
                max={5}
                value={skill.level}
                onChange={(e) =>
                  updateSkill(skill.id, 'level', Number(e.target.value))
                }
                className="w-full accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                {levelLabels.slice(1).map((l) => (
                  <span key={l}>{l}</span>
                ))}
              </div>
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <div
                    key={n}
                    className={`h-2 flex-1 rounded-full transition-colors ${
                      n <= skill.level ? 'bg-indigo-500' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      })}

      <button
        onClick={addSkill}
        className="w-full border-2 border-dashed border-indigo-300 rounded-xl py-3 text-indigo-500 hover:border-indigo-500 hover:text-indigo-700 transition-colors font-medium"
      >
        + Додати навичку
      </button>
    </div>
  );
}
