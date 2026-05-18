import { PortfolioData } from './types';

export interface ScoreCategory {
  name: string;
  score: number;
  maxScore: number;
  tips: string[];
}

export interface PortfolioScore {
  total: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  categories: ScoreCategory[];
  topTips: string[];
}

export function calculateScore(data: PortfolioData): PortfolioScore {
  const categories: ScoreCategory[] = [];

  // 1. Особисті дані (25 балів)
  const personalTips: string[] = [];
  let personalScore = 0;

  if (data.personal.name.trim()) personalScore += 5;
  else personalTips.push("Додайте ім'я та прізвище");

  if (data.personal.title.trim()) personalScore += 5;
  else personalTips.push('Вкажіть посаду або спеціальність');

  if (data.personal.bio.trim().length >= 100) personalScore += 10;
  else if (data.personal.bio.trim().length >= 20) {
    personalScore += 5;
    personalTips.push(
      'Розширте опис до 100+ символів — роботодавці читають перші 3 секунди',
    );
  } else personalTips.push('Додайте опис про себе (мінімум 100 символів)');

  if (data.personal.avatar) personalScore += 5;
  else
    personalTips.push(
      'Додайте фото профілю — портфоліо з фото отримують на 40% більше відгуків',
    );

  categories.push({
    name: 'Особисті дані',
    score: personalScore,
    maxScore: 25,
    tips: personalTips,
  });

  // 2. Проєкти (30 балів)
  const projectTips: string[] = [];
  let projectScore = 0;

  if (data.projects.length >= 3) projectScore += 15;
  else if (data.projects.length >= 1) {
    projectScore += 8;
    projectTips.push(
      `Додайте ще ${3 - data.projects.length} проєкти — оптимально 3-5`,
    );
  } else
    projectTips.push(
      'Додайте хоча б один проєкт — це найважливіша частина портфоліо',
    );

  const projectsWithUrl = data.projects.filter((p) => p.url).length;
  if (projectsWithUrl === data.projects.length && data.projects.length > 0)
    projectScore += 8;
  else if (projectsWithUrl > 0) {
    projectScore += 4;
    projectTips.push('Додайте посилання до всіх проєктів');
  } else if (data.projects.length > 0)
    projectTips.push(
      'Додайте посилання на GitHub або демо для кожного проєкту',
    );

  const projectsWithTags = data.projects.filter(
    (p) => p.tags.length >= 2,
  ).length;
  if (projectsWithTags === data.projects.length && data.projects.length > 0)
    projectScore += 7;
  else if (data.projects.length > 0) {
    projectScore += 3;
    projectTips.push('Додайте теги технологій до кожного проєкту');
  }

  categories.push({
    name: 'Проєкти',
    score: projectScore,
    maxScore: 30,
    tips: projectTips,
  });

  // 3. Навички (20 балів)
  const skillTips: string[] = [];
  let skillScore = 0;

  if (data.skills.length >= 5) skillScore += 10;
  else if (data.skills.length >= 1) {
    skillScore += 5;
    skillTips.push(`Додайте ще навички — оптимально 5-10`);
  } else skillTips.push('Додайте технічні навички');

  const avgLevel =
    data.skills.length > 0
      ? data.skills.reduce((sum, s) => sum + s.level, 0) / data.skills.length
      : 0;

  if (avgLevel >= 3) skillScore += 5;
  else if (data.skills.length > 0)
    skillTips.push('Вкажіть реальний рівень навичок');

  const categories_count = new Set(data.skills.map((s) => s.category)).size;
  if (categories_count >= 2) skillScore += 5;
  else if (data.skills.length > 0)
    skillTips.push('Розподіліть навички по категоріях');

  categories.push({
    name: 'Навички',
    score: skillScore,
    maxScore: 20,
    tips: skillTips,
  });

  // 4. Контакти (15 балів)
  const contactTips: string[] = [];
  let contactScore = 0;

  if (data.contacts.email.trim()) contactScore += 5;
  else contactTips.push("Додайте email для зв'язку");

  if (data.contacts.github) contactScore += 5;
  else contactTips.push("Додайте GitHub — це обов'язково для розробника");

  if (data.contacts.linkedin) contactScore += 3;
  else contactTips.push('LinkedIn підвищує довіру роботодавців');

  if (data.contacts.telegram) contactScore += 2;

  categories.push({
    name: 'Контакти',
    score: contactScore,
    maxScore: 15,
    tips: contactTips,
  });

  // 5. Досвід та освіта (10 балів)
  const expTips: string[] = [];
  let expScore = 0;

  if (data.experience.length >= 1) expScore += 5;
  else expTips.push('Додайте досвід роботи або стажування');

  if (data.education.length >= 1) expScore += 5;
  else expTips.push('Додайте інформацію про освіту');

  categories.push({
    name: 'Досвід та освіта',
    score: expScore,
    maxScore: 10,
    tips: expTips,
  });

  const total = categories.reduce((sum, c) => sum + c.score, 0);

  const grade: PortfolioScore['grade'] =
    total >= 90
      ? 'A'
      : total >= 75
        ? 'B'
        : total >= 60
          ? 'C'
          : total >= 40
            ? 'D'
            : 'F';

  const topTips = categories.flatMap((c) => c.tips).slice(0, 3);

  return { total, grade, categories, topTips };
}

export function getGradeColor(grade: string): string {
  switch (grade) {
    case 'A':
      return 'text-green-500';
    case 'B':
      return 'text-blue-500';
    case 'C':
      return 'text-yellow-500';
    case 'D':
      return 'text-orange-500';
    default:
      return 'text-red-500';
  }
}

export function getScoreColor(percent: number): string {
  if (percent >= 90) return 'bg-green-500';
  if (percent >= 75) return 'bg-blue-500';
  if (percent >= 60) return 'bg-yellow-500';
  if (percent >= 40) return 'bg-orange-500';
  return 'bg-red-500';
}
