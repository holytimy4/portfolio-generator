import { PortfolioData } from './types';

const STORAGE_KEY = 'portfolio_generator_data';
const TOKEN_KEY = 'portfolio_edit_token';
const SLUG_KEY = 'portfolio_slug';

export const defaultData: PortfolioData = {
  personal: { name: '', title: '', bio: '', avatar: '' },
  projects: [],
  skills: [],
  education: [],
  experience: [],
  contacts: { email: '', github: '', linkedin: '', telegram: '' },
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
      experience: parsed.experience || [],
    };
  } catch (e) {
    return defaultData;
  }
}

export function saveEditToken(slug: string, token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(SLUG_KEY, slug);
  } catch (e) {
    console.error('Failed to save token', e);
  }
}

export function loadEditToken(): { slug: string; token: string } | null {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const slug = localStorage.getItem(SLUG_KEY);
    if (!token || !slug) return null;
    return { slug, token };
  } catch (e) {
    return null;
  }
}

export function clearStorage(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(SLUG_KEY);
}
