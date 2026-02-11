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
