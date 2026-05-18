'use client';

import { useState, useEffect } from 'react';
import { PortfolioData, Step } from '@/lib/types';
import {
  saveToStorage,
  loadFromStorage,
  clearStorage,
  defaultData,
  saveEditToken,
  loadEditToken,
} from '@/lib/storage';
import {
  validate,
  isValid,
  getCompletionPercent,
  ValidationErrors,
} from '@/lib/validation';
import { exportToPdf } from '@/lib/exportPdf';

import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import AnimatedStep from './AnimatedStep';
import StepPersonal from './steps/StepPersonal';
import StepProjects from './steps/StepProjects';
import StepSkills from './steps/StepSkills';
import StepEducation from './steps/StepEducation';
import StepExperience from './steps/StepExperience';
import StepContacts from './steps/StepContacts';
import ThemePicker from './ThemePicker';
import Preview from './Preview';
import QRModal from './QRModal';

const steps: { id: Step; label: string; icon: string }[] = [
  { id: 'personal', label: 'Особисті дані', icon: '👤' },
  { id: 'projects', label: 'Проєкти', icon: '📁' },
  { id: 'skills', label: 'Навички', icon: '⚡' },
  { id: 'education', label: 'Освіта', icon: '🎓' },
  { id: 'experience', label: 'Досвід', icon: '💼' },
  { id: 'contacts', label: 'Контакти', icon: '✉' },
  { id: 'preview', label: 'Перегляд', icon: '👁' },
];

export default function FormWizard() {
  const [currentStep, setCurrentStep] = useState<Step>('personal');
  const [data, setData] = useState<PortfolioData>(defaultData);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | null>(null);
  const [publishUrl, setPublishUrl] = useState<string | null>(null);
  const [publishedSlug, setPublishedSlug] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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
    setPublishUrl(null);
    setPublishedSlug(null);
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
    } catch {
      alert('Помилка генерації. Спробуйте ще раз.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    setPublishUrl(null);
    try {
      const existingEdit = loadEditToken();
      const body = existingEdit
        ? { data, editToken: existingEdit.token, slug: existingEdit.slug }
        : { data };

      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const result = await response.json();
      if (result.slug) {
        const fullUrl = `${window.location.origin}/p/${result.slug}`;
        setPublishUrl(fullUrl);
        setPublishedSlug(result.slug);
        if (result.editToken) {
          saveEditToken(result.slug, result.editToken);
        }
      }
    } catch {
      alert('Помилка публікації. Спробуйте ще раз.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCopy = () => {
    if (!publishUrl) return;
    navigator.clipboard.writeText(publishUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportPdf = async () => {
    if (!publishedSlug) {
      alert('Спочатку опублікуйте портфоліо, потім скачайте PDF.');
      return;
    }
    setIsExportingPdf(true);
    try {
      await exportToPdf(publishedSlug, data.personal.name || 'portfolio');
    } catch {
      alert('Помилка експорту PDF. Спробуйте ще раз.');
    } finally {
      setIsExportingPdf(false);
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
      case 'experience':
        return (
          <StepExperience data={data} onChange={handleChange} errors={errors} />
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
      <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 md:py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-base md:text-xl font-bold text-gray-900 truncate">
              Portfolio Generator
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="w-20 md:w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${completion}%` }}
                />
              </div>
              <span className="text-xs text-gray-500">{completion}%</span>
              {saveStatus === 'saved' && (
                <span className="text-xs text-green-500 hidden sm:inline">
                  ✓ Збережено
                </span>
              )}
            </div>
          </div>

          {/* Desktop buttons */}
          <div className="hidden md:flex items-center gap-1.5 flex-wrap justify-end">
            <Link
              href="/stats"
              className="text-xs text-gray-400 hover:text-indigo-500 transition-colors px-2 py-1"
            >
              📊
            </Link>
            <Link
              href="/gallery"
              target="_blank"
              className="text-xs text-gray-400 hover:text-indigo-500 transition-colors px-2 py-1"
            >
              🌐
            </Link>
            <ThemeToggle />
            <button
              onClick={() => setShowResetConfirm(true)}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors px-2 py-1"
            >
              Скинути
            </button>
            <button
              onClick={handleDownload}
              disabled={isGenerating || !data.personal.name}
              className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {isGenerating ? '...' : '⬇ HTML'}
            </button>
            <button
              onClick={handlePublish}
              disabled={isPublishing || !data.personal.name}
              className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {isPublishing
                ? '...'
                : publishedSlug
                  ? '🔄 Оновити'
                  : '🌐 Публікувати'}
            </button>
            <button
              onClick={handleExportPdf}
              disabled={isExportingPdf || !publishedSlug}
              title={!publishedSlug ? 'Спочатку опублікуйте' : 'Скачати PDF'}
              className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {isExportingPdf ? '...' : '📄 PDF'}
            </button>
            <button
              onClick={() => setShowQR(true)}
              disabled={!publishedSlug}
              title={!publishedSlug ? 'Спочатку опублікуйте' : 'QR-код'}
              className="bg-purple-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              📱 QR
            </button>
          </div>

          {/* Mobile buttons */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setShowMobilePreview(true)}
              className="text-sm bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg"
            >
              👁
            </button>
            <button
              onClick={() => setShowMobileMenu(true)}
              className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg"
            >
              ⋯
            </button>
          </div>
        </div>
      </header>

      {/* Publish banner */}
      {publishUrl && (
        <div className="bg-green-50 border-b border-green-200 px-4 md:px-6 py-3">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-green-600 text-sm font-medium shrink-0">
                ✓ Опубліковано!
              </span>
              <a
                href={publishUrl}
                target="_blank"
                rel="noreferrer"
                className="text-green-700 text-sm underline truncate"
              >
                {publishUrl}
              </a>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleCopy}
                className="text-xs bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
              >
                {copied ? '✓ Скопійовано' : 'Копіювати'}
              </button>
              <button
                onClick={() => setShowQR(true)}
                className="text-xs bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700"
              >
                QR
              </button>
              <button
                onClick={() => setPublishUrl(null)}
                className="text-green-400 hover:text-green-600"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Modal */}
      {showQR && publishUrl && (
        <QRModal url={publishUrl} onClose={() => setShowQR(false)} />
      )}

      {/* Reset confirm modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full">
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

      {/* Mobile menu modal */}
      {showMobileMenu && (
        <div className="fixed inset-0 bg-black/40 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-2xl p-6 w-full space-y-3">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Дії</h3>
            <button
              onClick={() => {
                handleDownload();
                setShowMobileMenu(false);
              }}
              disabled={isGenerating || !data.personal.name}
              className="w-full bg-indigo-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-40 text-left"
            >
              ⬇ Скачати HTML
            </button>
            <button
              onClick={() => {
                handlePublish();
                setShowMobileMenu(false);
              }}
              disabled={isPublishing || !data.personal.name}
              className="w-full bg-green-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-green-700 disabled:opacity-40 text-left"
            >
              🌐 Опублікувати
            </button>
            <button
              onClick={() => {
                handleExportPdf();
                setShowMobileMenu(false);
              }}
              disabled={isExportingPdf || !publishedSlug}
              className="w-full bg-red-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-red-700 disabled:opacity-40 text-left"
            >
              📄 Скачати PDF
            </button>
            <button
              onClick={() => {
                setShowQR(true);
                setShowMobileMenu(false);
              }}
              disabled={!publishedSlug}
              className="w-full bg-purple-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-purple-700 disabled:opacity-40 text-left"
            >
              📱 QR-код
            </button>
            <Link
              href="/stats"
              onClick={() => setShowMobileMenu(false)}
              className="w-full block bg-gray-100 text-gray-700 px-4 py-3 rounded-xl font-medium text-left"
            >
              📊 Статистика
            </Link>
            <button
              onClick={() => {
                setShowResetConfirm(true);
                setShowMobileMenu(false);
              }}
              className="w-full bg-red-50 text-red-500 px-4 py-3 rounded-xl font-medium text-left"
            >
              🗑 Скинути все
            </button>
            <button
              onClick={() => setShowMobileMenu(false)}
              className="w-full bg-gray-50 text-gray-400 px-4 py-3 rounded-xl text-left"
            >
              Закрити
            </button>
          </div>
        </div>
      )}

      {/* Mobile preview modal */}
      {showMobilePreview && (
        <div className="fixed inset-0 bg-black/80 flex flex-col z-50">
          <div className="flex items-center justify-between px-4 py-3 bg-white">
            <h3 className="font-bold text-gray-900">Попередній перегляд</h3>
            <button
              onClick={() => setShowMobilePreview(false)}
              className="text-gray-500 text-lg"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 bg-white overflow-auto">
            {isClient && <Preview data={data} />}
          </div>
        </div>
      )}

      {/* Steps navigation */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-2 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex gap-1 min-w-max">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              className={`flex items-center gap-1.5 px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentStep === step.id
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span
                className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-xs shrink-0 ${
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
      <main className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Left: Form */}
          <div className="space-y-4 md:space-y-6">
            {currentStep !== 'preview' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
                <AnimatedStep stepKey={currentStep}>
                  {renderStep()}
                </AnimatedStep>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
              <ThemePicker data={data} onChange={handleChange} />
            </div>

            {currentStep !== 'preview' && (
              <div className="flex justify-between">
                <button
                  onClick={() =>
                    setCurrentStep(steps[currentIndex - 1]?.id || 'personal')
                  }
                  disabled={currentIndex === 0}
                  className="px-4 md:px-5 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  ← Назад
                </button>
                <button
                  onClick={() =>
                    setCurrentStep(steps[currentIndex + 1]?.id || 'preview')
                  }
                  className="px-4 md:px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors text-sm"
                >
                  {currentIndex === steps.length - 2
                    ? 'Переглянути →'
                    : 'Далі →'}
                </button>
              </div>
            )}
          </div>

          {/* Right: Preview hidden on mobile */}
          <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24 self-start">
            {isClient && <Preview data={data} />}
          </div>
        </div>
      </main>
    </div>
  );
}
