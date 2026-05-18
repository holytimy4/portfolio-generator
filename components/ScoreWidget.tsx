'use client';

import { useState } from 'react';
import { PortfolioData } from '@/lib/types';
import { calculateScore, getGradeColor, getScoreColor } from '@/lib/scoring';

interface Props {
  data: PortfolioData;
}

export default function ScoreWidget({ data }: Props) {
  const [expanded, setExpanded] = useState(false);
  const score = calculateScore(data);

  const gradeColor = getGradeColor(score.grade);
  const scoreColor = getScoreColor(score.total);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div
        className="p-4 cursor-pointer flex items-center justify-between"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className="relative w-14 h-14">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
              <circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-gray-200 dark:text-gray-700"
              />
              <circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${(score.total / 100) * 150.8} 150.8`}
                className={scoreColor.replace('bg-', 'stroke-')}
              />
            </svg>
            <span
              className={`absolute inset-0 flex items-center justify-center text-sm font-bold ${gradeColor}`}
            >
              {score.grade}
            </span>
          </div>
          <div>
            <p className="font-bold text-gray-900 dark:text-gray-100">
              Оцінка портфоліо
            </p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              {score.total}
              <span className="text-sm text-gray-400">/100</span>
            </p>
          </div>
        </div>
        <span className="text-gray-400 text-sm">
          {expanded ? '▲ Згорнути' : '▼ Деталі'}
        </span>
      </div>

      {/* Progress bar */}
      <div className="px-4 pb-3">
        <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${scoreColor}`}
            style={{ width: `${score.total}%` }}
          />
        </div>
      </div>

      {/* Top tips */}
      {score.topTips.length > 0 && !expanded && (
        <div className="px-4 pb-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-2">
            💡 Топ рекомендації:
          </p>
          {score.topTips.map((tip, i) => (
            <p
              key={i}
              className="text-xs text-gray-600 dark:text-gray-400 mb-1"
            >
              • {tip}
            </p>
          ))}
        </div>
      )}

      {/* Expanded details */}
      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-gray-100 dark:border-gray-700 pt-4">
          {score.categories.map((cat) => (
            <div key={cat.name}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {cat.name}
                </span>
                <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                  {cat.score}/{cat.maxScore}
                </span>
              </div>
              <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getScoreColor((cat.score / cat.maxScore) * 100)}`}
                  style={{ width: `${(cat.score / cat.maxScore) * 100}%` }}
                />
              </div>
              {cat.tips.map((tip, i) => (
                <p
                  key={i}
                  className="text-xs text-orange-500 dark:text-orange-400 mb-1"
                >
                  ⚠ {tip}
                </p>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
