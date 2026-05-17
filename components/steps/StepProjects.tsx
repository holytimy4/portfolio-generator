'use client';

import { useState } from 'react';
import { PortfolioData, Project } from '@/lib/types';
import { ValidationErrors } from '@/lib/validation';

interface Props {
  data: PortfolioData;
  onChange: (data: PortfolioData) => void;
  errors: ValidationErrors;
}

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

export default function StepProjects({ data, onChange, errors }: Props) {
  const [tagInputs, setTagInputs] = useState<{ [id: string]: string }>({});

  const getTagInput = (project: Project) => {
    if (tagInputs[project.id] !== undefined) return tagInputs[project.id];
    return project.tags.join(', ');
  };

  const addProject = () => {
    const newProject: Project = {
      id: generateId(),
      title: '',
      description: '',
      url: '',
      tags: [],
    };
    onChange({ ...data, projects: [...data.projects, newProject] });
  };

  const updateProject = (id: string, field: string, value: string) => {
    onChange({
      ...data,
      projects: data.projects.map((p) =>
        p.id === id ? { ...p, [field]: value } : p,
      ),
    });
  };

  const handleTagInput = (id: string, value: string) => {
    setTagInputs((prev) => ({ ...prev, [id]: value }));
  };

  const handleTagBlur = (id: string, value: string) => {
    const tags = value
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    setTagInputs((prev) => ({ ...prev, [id]: tags.join(', ') }));
    onChange({
      ...data,
      projects: data.projects.map((p) => (p.id === id ? { ...p, tags } : p)),
    });
  };

  const removeProject = (id: string) => {
    const newInputs = { ...tagInputs };
    delete newInputs[id];
    setTagInputs(newInputs);
    onChange({ ...data, projects: data.projects.filter((p) => p.id !== id) });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Проєкти</h2>

      {data.projects.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p className="text-4xl mb-3">📁</p>
          <p className="text-sm">Додайте хоча б один проєкт</p>
          <p className="text-xs mt-1">Це найважливіша частина портфоліо</p>
        </div>
      )}

      {data.projects.map((project, index) => {
        const projectErrors = errors.projects?.[project.id] || {};
        return (
          <div
            key={project.id}
            className="border border-gray-200 rounded-xl p-5 space-y-4 bg-gray-50"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-700">
                Проєкт #{index + 1}
              </h3>
              <button
                onClick={() => removeProject(project.id)}
                className="text-red-400 hover:text-red-600 text-sm transition-colors"
              >
                Видалити
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Назва *
              </label>
              <input
                type="text"
                value={project.title}
                onChange={(e) =>
                  updateProject(project.id, 'title', e.target.value)
                }
                placeholder="Portfolio Generator"
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  projectErrors.title
                    ? 'border-red-400 bg-red-50'
                    : 'border-gray-300'
                }`}
              />
              {projectErrors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {projectErrors.title}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Опис *
              </label>
              <textarea
                value={project.description}
                onChange={(e) =>
                  updateProject(project.id, 'description', e.target.value)
                }
                placeholder="Що це за проєкт, яку проблему вирішує..."
                rows={3}
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none ${
                  projectErrors.description
                    ? 'border-red-400 bg-red-50'
                    : 'border-gray-300'
                }`}
              />
              {projectErrors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {projectErrors.description}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Посилання
              </label>
              <input
                type="text"
                value={project.url}
                onChange={(e) =>
                  updateProject(project.id, 'url', e.target.value)
                }
                placeholder="https://github.com/..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Теги{' '}
                <span className="text-gray-400 font-normal">(через кому)</span>
              </label>
              <input
                type="text"
                value={getTagInput(project)}
                onChange={(e) => handleTagInput(project.id, e.target.value)}
                onBlur={(e) => handleTagBlur(project.id, e.target.value)}
                placeholder="React, TypeScript, Next.js"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {project.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-indigo-50 text-indigo-600 text-xs px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}

      <button
        onClick={addProject}
        className="w-full border-2 border-dashed border-indigo-300 rounded-xl py-3 text-indigo-500 hover:border-indigo-500 hover:text-indigo-700 transition-colors font-medium"
      >
        + Додати проєкт
      </button>
    </div>
  );
}
