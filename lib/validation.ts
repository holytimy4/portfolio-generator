import { PortfolioData } from './types';

export interface ValidationErrors {
  name?: string;
  title?: string;
  bio?: string;
  email?: string;
  projects?: { [id: string]: { title?: string; description?: string } };
}

export function validate(data: PortfolioData): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.personal.name.trim()) {
    errors.name = "Ім'я обов'язкове";
  }

  if (!data.personal.title.trim()) {
    errors.title = "Посада обов'язкова";
  }

  if (!data.personal.bio.trim()) {
    errors.bio = "Опис обов'язковий";
  } else if (data.personal.bio.trim().length < 20) {
    errors.bio = 'Опис занадто короткий (мінімум 20 символів)';
  }

  if (!data.contacts.email.trim()) {
    errors.email = "Email обов'язковий";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contacts.email)) {
    errors.email = 'Невірний формат email';
  }

  const projectErrors: ValidationErrors['projects'] = {};
  data.projects.forEach((p) => {
    const err: { title?: string; description?: string } = {};
    if (!p.title.trim()) err.title = "Назва обов'язкова";
    if (!p.description.trim()) err.description = "Опис обов'язковий";
    if (Object.keys(err).length > 0) projectErrors[p.id] = err;
  });

  if (Object.keys(projectErrors).length > 0) {
    errors.projects = projectErrors;
  }

  return errors;
}

export function isValid(errors: ValidationErrors): boolean {
  return Object.keys(errors).length === 0;
}

export function getCompletionPercent(data: PortfolioData): number {
  let total = 0;
  let filled = 0;

  // Personal
  total += 3;
  if (data.personal.name.trim()) filled++;
  if (data.personal.title.trim()) filled++;
  if (data.personal.bio.trim().length >= 20) filled++;

  // Contacts
  total += 1;
  if (data.contacts.email.trim()) filled++;

  // Projects
  total += 1;
  if (data.projects.length > 0) filled++;

  return Math.round((filled / total) * 100);
}
