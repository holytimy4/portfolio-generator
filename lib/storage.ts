import { PortfolioData } from './types';

const STORAGE_KEY = 'portfolio_generator_data';

export const defaultData: PortfolioData = {
  personal: {
    name: '',
    title: '',
    bio: '',
  },
  projects: [],
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
    return { ...defaultData, ...JSON.parse(raw) };
  } catch (e) {
    return defaultData;
  }
}

export function clearStorage(): void {
  localStorage.removeItem(STORAGE_KEY);
}
