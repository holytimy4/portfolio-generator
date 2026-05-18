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

export interface Skill {
  id: string;
  name: string;
  level: number;
  category: string;
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  year: string;
  description?: string;
}

export interface Experience {
  id: string;
  position: string;
  company: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
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
  skills: Skill[];
  education: Education[];
  experience: Experience[];
  contacts: ContactInfo;
  theme: 'minimal' | 'dark' | 'creative';
}

export interface ContactInfo {
  email: string;
  github?: string;
  linkedin?: string;
  telegram?: string;
  telegramChatId?: string;
}

export type Step =
  | 'personal'
  | 'projects'
  | 'skills'
  | 'education'
  | 'experience'
  | 'contacts'
  | 'preview';
