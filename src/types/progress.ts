import { Level } from './problem';

export interface ProblemAttempt {
  problemId: string;
  status: 'not_started' | 'attempted' | 'completed';
  attempts: number;
  bestQuery?: string;
  completedAt?: string;
  hintsUsed: number;
}

export interface LevelProgress {
  totalProblems: number;
  completedProblems: number;
  percentage: number;
  unlocked: boolean;
}

export interface UserProgress {
  completedProblems: Record<string, ProblemAttempt>;
  currentLevel: Level;
  levelProgress: Record<Level, LevelProgress>;
  totalScore: number;
  lastActiveAt: string;
}
