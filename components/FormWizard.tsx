'use client';

import { useState, useEffect } from 'react';
import { PortfolioData, Step } from '@/lib/types';
import {
  saveToStorage,
  loadFromStorage,
  clearStorage,
  defaultData,
} from '@/lib/storage';
import {
  validate,
  isValid,
  getCompletionPercent,
  ValidationErrors,
} from '@/lib/validation';
import Link from 'next/link';
import AnimatedStep from './AnimatedStep';
import StepPersonal from './steps/StepPersonal';
import StepProjects from './steps/StepProjects';
import StepSkills from './steps/StepSkills';
import StepEducation from './steps/StepEducation';
import StepContacts from './steps/StepContacts';
import ThemePicker from './ThemePicker';
import Preview from './Preview';

const steps: { id: Step; label: string; icon: string }[] = [
  { id: 'personal', label: 'Особисті дані', icon: '👤' },
  { id: 'projects', label: 'Проєкти', icon: '📁' },
  { id: 'skills', label: 'Навички', icon: '⚡' },
  { id: 'education', label: 'Освіта', icon: '🎓' },
  { id: 'contacts', label: 'Контакти', icon: '✉' },
  { id: 'preview', label: 'Перегляд', icon: '👁' },
];

export default function FormWizard() {
  const [currentStep, setCurrentStep] = useState<Step>('personal');
  const [data, setData] = useState<PortfolioData>(defaultData);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | null>(null);

  useEffect(() => {
    setIsClient(true);
    setData(loadFromStorage());
  }, []);

  useEffect(() => {
    if (!isClient) return;
    setSaveStatus('saving');
    const timer = setTimeout(() => {
      saveToStorage(data);
      setSaveStatus('saved');
    }, 500);
    return () => clearTimeout(timer);
  }, [data, isClient]);

  const currentIndex = steps.findIndex((s) => s.id === currentStep);
  const completion = getCompletionPercent(data);

  const handleChange = (newData: PortfolioData) => {
    setData(newData);
    setErrors(validate(newData));
  };

  const handleReset = () => {
    setData(defaultData);
    clearStorage();
    setCurrentStep('personal');
    setErrors({});
    setShowResetConfirm(false);
  };

  const handleDownload = async () => {
    const validationErrors = validate(data);
    if (!isValid(validationErrors)) {
      setErrors(validationErrors);
      alert("Будь ласка, заповніть усі обов'язкові поля перед скачуванням.");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Generation failed');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `portfolio-${data.personal.name.replace(/\s+/g, '-').toLowerCase() || 'my'}.html`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('Помилка генерації. Спробуйте ще раз.');
    } finally {
      setIsGenerating(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'personal':
        return (
          <StepPersonal data={data} onChange={handleChange} errors={errors} />
        );
      case 'projects':
        return (
          <StepProjects data={data} onChange={handleChange} errors={errors} />
        );
      case 'skills':
        return (
          <StepSkills data={data} onChange={handleChange} errors={errors} />
        );
      case 'education':
        return (
          <StepEducation data={data} onChange={handleChange} errors={errors} />
        );
      case 'contacts':
        return (
          <StepContacts data={data} onChange={handleChange} errors={errors} />
        );
      case 'preview':
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Portfolio Generator
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <div className="w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${completion}%` }}
                />
              </div>
              <span className="text-xs text-gray-500">
                {completion}% заповнено
              </span>
              {saveStatus === 'saved' && (
                <span className="text-xs text-green-500">✓ Збережено</span>
              )}
              {saveStatus === 'saving' && (
                <span className="text-xs text-gray-400">Зберігання...</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/stats"
              className="text-sm text-gray-400 hover:text-indigo-500 transition-colors"
            >
              📊 Статистика
            </Link>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="text-sm text-gray-400 hover:text-red-500 transition-colors"
            >
              Скинути все
            </button>
            <button
              onClick={handleDownload}
              disabled={isGenerating || !data.personal.name}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {isGenerating ? 'Генерація...' : '⬇ Скачати HTML'}
            </button>
          </div>
        </div>
      </header>

      {/* Reset confirm modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Скинути все?
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Всі введені дані буде видалено. Цю дію не можна скасувати.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
              >
                Скасувати
              </button>
              <button
                onClick={handleReset}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Скинути
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Steps navigation */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex gap-1 min-w-max">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentStep === step.id
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  currentStep === step.id
                    ? 'bg-indigo-600 text-white'
                    : index < currentIndex
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                }`}
              >
                {index < currentIndex ? '✓' : index + 1}
              </span>
              <span className="hidden sm:inline">{step.label}</span>
              <span className="sm:hidden">{step.icon}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Form */}
          <div className="space-y-6">
            {currentStep !== 'preview' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <AnimatedStep stepKey={currentStep}>
                  {renderStep()}
                </AnimatedStep>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <ThemePicker data={data} onChange={handleChange} />
            </div>

            {currentStep !== 'preview' && (
              <div className="flex justify-between">
                <button
                  onClick={() =>
                    setCurrentStep(steps[currentIndex - 1]?.id || 'personal')
                  }
                  disabled={currentIndex === 0}
                  className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  ← Назад
                </button>
                <button
                  onClick={() =>
                    setCurrentStep(steps[currentIndex + 1]?.id || 'preview')
                  }
                  className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                >
                  {currentIndex === steps.length - 2
                    ? 'Переглянути →'
                    : 'Далі →'}
                </button>
              </div>
            )}
          </div>

          {/* Right: Preview */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6 self-start">
            {isClient && <Preview data={data} />}
          </div>
        </div>
      </main>
    </div>
  );
}
