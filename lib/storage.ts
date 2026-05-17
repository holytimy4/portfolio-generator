import { PortfolioData } from './types';

const STORAGE_KEY = 'portfolio_generator_data';

export const defaultData: PortfolioData = {
  personal: {
    name: '',
    title: '',
    bio: '',
    avatar: '',
  },
  projects: [],
  skills: [],
  education: [],
  contacts: {
    email: '',
    github: '',
    linkedin: '',
    telegram: '',
  },
  theme: 'minimal',
};

export function saveToStorage(data: PortfolioData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
}

export function loadFromStorage(): PortfolioData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultData;
    const parsed = JSON.parse(raw);
    return {
      ...defaultData,
      ...parsed,
      skills: parsed.skills || [],
      education: parsed.education || [],
    };
  } catch (e) {
    return defaultData;
  }
}

export function clearStorage(): void {
  localStorage.removeItem(STORAGE_KEY);
}
