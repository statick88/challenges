// src/types/challenges.ts
export interface ChallengeFrontMatter {
  title?: string;
  category?: string;
  difficulty?: string;
  tags?: string[];
  date?: string;
  status?: string;
  platform?: string;
  flag?: string;
  duration?: string;
  author?: string;
}

export interface Step {
  title: string;
  commands?: string[];
  output?: string;
  explanation?: string;
}

export interface ChallengeData {
  frontMatter: ChallengeFrontMatter;
  steps: Step[];
  content: string;
}

export interface ChallengeCardProps {
  title: string;
  category: string;
  difficulty?: string;
  status?: string;
  date?: string;
  href: string;
}

export interface ChallengeModalProps {
  id: string;
  title: string;
  category?: string;
  difficulty?: string;
  flag?: string;
  steps: Step[];
  verification?: string[];
  learnings?: string[];
  summary?: string;
  tools?: string[];
  troubleshooting?: string;
}

// Dashboard Types
export interface ProgramStats {
  completed: number;
  inProgress: number;
  ready: number;
  blocked: number;
  total: number;
  percentage: number;
  name?: string;
  icon?: string;
  description?: string;
  path?: string;
}

export interface CTFCategory {
  name: string;
  total: number;
  completed: number;
}

export interface Overview {
  totalChallenges: number;
  completed: number;
  ctfCompleted: number;
  completionRate: number;
}

export interface RecentActivity {
  icon: string;
  activity: string;
  program: string;
}

export interface Programs {
  linux: ProgramStats;
  docker: ProgramStats;
  devops: ProgramStats;
  ctf: ProgramStats & { categories?: CTFCategory[] };
  htb: ProgramStats;
}

export interface ChallengesData {
  lastUpdated: string;
  buildVersion: number;
  overview: Overview;
  programs: Programs;
  recentActivity: RecentActivity[];
  ctfCategories?: CTFCategory[];
}

export interface Certification {
  id: string;
  title: string;
  platform: string;
  image: string;
  verifyUrl: string;
  date: string;
  challengesCompleted: number;
  totalChallenges: number;
}

export type ProgramKey = 'linux' | 'docker' | 'devops' | 'ctf' | 'htb';
