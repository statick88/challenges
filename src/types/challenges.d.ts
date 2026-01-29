---
export interface ChallengesData {
  lastUpdated: string;
  overview: Overview;
  programs: Programs;
  recentActivity: Activity[];
  skills: string[];
}

export interface Overview {
  totalChallenges: number;
  completed: number;
  completionRate: number;
  streak: number;
}

export interface Programs {
  linux: ProgramData;
  docker: ProgramData;
  devops: ProgramData;
}

export interface ProgramData {
  total: number;
  completed: number;
  percentage: number;
  recentActivity: string[];
  skills: string[];
  name: string;
  icon: string;
  color: string;
}

export interface Activity {
  program: string;
  activity: string;
  icon: string;
}