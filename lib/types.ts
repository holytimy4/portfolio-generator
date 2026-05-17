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
  level: number; // 1-5
  category: string;
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  year: string;
  description?: string;
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
  contacts: ContactInfo;
  theme: 'minimal' | 'dark' | 'creative';
}

export type Step =
  | 'personal'
  | 'projects'
  | 'skills'
  | 'education'
  | 'contacts'
  | 'preview';
