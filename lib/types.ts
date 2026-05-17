export interface PersonalInfo {
  name: string;
  title: string;
  bio: string;
  avatar?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  url?: string;
  tags: string[];
}

export interface ContactInfo {
  email: string;
  github?: string;
  linkedin?: string;
  telegram?: string;
}

export interface PortfolioData {
  personal: PersonalInfo;
  projects: Project[];
  contacts: ContactInfo;
  theme: 'minimal' | 'dark' | 'creative';
}

export type Step = 'personal' | 'projects' | 'contacts' | 'preview';
