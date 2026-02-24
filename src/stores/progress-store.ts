'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Level } from '@/types/problem';
import type { UserProgress, ProblemAttempt, LevelProgress } from '@/types/progress';
import { getAllProblems } from '@/data/problems';

const LEVEL_ORDER: Level[] = ['beginner', 'intermediate', 'advanced', 'expert'];
const UNLOCK_THRESHOLD = 0.8;

function createInitialProgress(): UserProgress {
  return {
    completedProblems: {},
    currentLevel: 'beginner',
    levelProgress: {
      beginner: { totalProblems: 0, completedProblems: 0, percentage: 0, unlocked: true },
      intermediate: { totalProblems: 0, completedProblems: 0, percentage: 0, unlocked: false },
      advanced: { totalProblems: 0, completedProblems: 0, percentage: 0, unlocked: false },
      expert: { totalProblems: 0, completedProblems: 0, percentage: 0, unlocked: false },
    },
    totalScore: 0,
    lastActiveAt: new Date().toISOString(),
  };
}

interface ProgressStore {
  progress: UserProgress;
  completeProblem: (problemId: string, query: string, hintsUsed: number) => void;
  recordAttempt: (problemId: string) => void;
  isLevelUnlocked: (level: Level) => boolean;
  getLevelProgress: (level: Level) => LevelProgress;
  getAttempt: (problemId: string) => ProblemAttempt | undefined;
  resetProgress: () => void;
  recalculateProgress: () => void;
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      progress: createInitialProgress(),

      completeProblem: (problemId, query, hintsUsed) => {
        set((state) => {
          const updated = structuredClone(state.progress);
          const existing = updated.completedProblems[problemId];

          updated.completedProblems[problemId] = {
            problemId,
            status: 'completed',
            attempts: (existing?.attempts || 0) + 1,
            bestQuery: query,
            completedAt: new Date().toISOString(),
            hintsUsed: Math.min(existing?.hintsUsed ?? hintsUsed, hintsUsed),
          };

          updated.lastActiveAt = new Date().toISOString();

          // Recalculate level progress
          const problems = getAllProblems();
          for (const level of LEVEL_ORDER) {
            const levelProblems = problems.filter((p) => p.level === level);
            const completedCount = levelProblems.filter(
              (p) => updated.completedProblems[p.id]?.status === 'completed'
            ).length;

            updated.levelProgress[level] = {
              totalProblems: levelProblems.length,
              completedProblems: completedCount,
              percentage: levelProblems.length > 0 ? Math.round((completedCount / levelProblems.length) * 100) : 0,
              unlocked: updated.levelProgress[level].unlocked,
            };
          }

          // Unlock levels based on previous level completion
          for (let i = 1; i < LEVEL_ORDER.length; i++) {
            const prevLevel = LEVEL_ORDER[i - 1];
            const currentLevel = LEVEL_ORDER[i];
            if (updated.levelProgress[prevLevel].percentage >= UNLOCK_THRESHOLD * 100) {
              updated.levelProgress[currentLevel].unlocked = true;
            }
          }

          return { progress: updated };
        });
      },

      recordAttempt: (problemId) => {
        set((state) => {
          const updated = structuredClone(state.progress);
          const existing = updated.completedProblems[problemId];

          if (!existing || existing.status !== 'completed') {
            updated.completedProblems[problemId] = {
              problemId,
              status: 'attempted',
              attempts: (existing?.attempts || 0) + 1,
              hintsUsed: existing?.hintsUsed || 0,
            };
          }

          updated.lastActiveAt = new Date().toISOString();
          return { progress: updated };
        });
      },

      isLevelUnlocked: (level) => {
        return get().progress.levelProgress[level]?.unlocked ?? false;
      },

      getLevelProgress: (level) => {
        return (
          get().progress.levelProgress[level] ?? {
            totalProblems: 0,
            completedProblems: 0,
            percentage: 0,
            unlocked: false,
          }
        );
      },

      getAttempt: (problemId) => {
        return get().progress.completedProblems[problemId];
      },

      resetProgress: () => {
        set({ progress: createInitialProgress() });
      },

      recalculateProgress: () => {
        set((state) => {
          const updated = structuredClone(state.progress);
          const problems = getAllProblems();

          for (const level of LEVEL_ORDER) {
            const levelProblems = problems.filter((p) => p.level === level);
            const completedCount = levelProblems.filter(
              (p) => updated.completedProblems[p.id]?.status === 'completed'
            ).length;

            updated.levelProgress[level] = {
              ...updated.levelProgress[level],
              totalProblems: levelProblems.length,
              completedProblems: completedCount,
              percentage: levelProblems.length > 0 ? Math.round((completedCount / levelProblems.length) * 100) : 0,
            };
          }

          return { progress: updated };
        });
      },
    }),
    { name: 'sql-dba-progress' }
  )
);
