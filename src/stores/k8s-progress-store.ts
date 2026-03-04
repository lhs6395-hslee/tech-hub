'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { KubeLevel } from '@/types/kubernetes';
import { getAllK8sProblems } from '@/data/k8s-problems';

interface K8sProblemAttempt {
  problemId: string;
  status: 'not_started' | 'attempted' | 'completed';
  attempts: number;
  bestAnswer?: string;
  completedAt?: string;
  hintsUsed: number;
}

interface K8sLevelProgress {
  totalProblems: number;
  completedProblems: number;
  percentage: number;
}

interface K8sUserProgress {
  completedProblems: Record<string, K8sProblemAttempt>;
  domainProgress: Record<KubeLevel, K8sLevelProgress>;
  lastActiveAt: string;
}

const DOMAINS: KubeLevel[] = [
  'cluster-architecture',
  'workloads-scheduling',
  'services-networking',
  'storage',
  'troubleshooting',
];

function createInitialProgress(): K8sUserProgress {
  const domainProgress = {} as Record<KubeLevel, K8sLevelProgress>;
  for (const domain of DOMAINS) {
    domainProgress[domain] = { totalProblems: 0, completedProblems: 0, percentage: 0 };
  }

  return {
    completedProblems: {},
    domainProgress,
    lastActiveAt: new Date().toISOString(),
  };
}

interface K8sProgressStore {
  progress: K8sUserProgress;
  completeProblem: (problemId: string, answer: string, hintsUsed: number) => void;
  recordAttempt: (problemId: string) => void;
  getDomainProgress: (domain: KubeLevel) => K8sLevelProgress;
  getAttempt: (problemId: string) => K8sProblemAttempt | undefined;
  resetProgress: () => void;
  recalculateProgress: () => void;
}

export const useK8sProgressStore = create<K8sProgressStore>()(
  persist(
    (set, get) => ({
      progress: createInitialProgress(),

      completeProblem: (problemId, answer, hintsUsed) => {
        set((state) => {
          const updated = structuredClone(state.progress);
          const existing = updated.completedProblems[problemId];

          updated.completedProblems[problemId] = {
            problemId,
            status: 'completed',
            attempts: (existing?.attempts || 0) + 1,
            bestAnswer: answer,
            completedAt: new Date().toISOString(),
            hintsUsed: Math.min(existing?.hintsUsed ?? hintsUsed, hintsUsed),
          };

          updated.lastActiveAt = new Date().toISOString();

          // Recalculate domain progress
          const problems = getAllK8sProblems();
          for (const domain of DOMAINS) {
            const domainProblems = problems.filter((p) => p.domain === domain);
            const completedCount = domainProblems.filter(
              (p) => updated.completedProblems[p.id]?.status === 'completed'
            ).length;

            updated.domainProgress[domain] = {
              totalProblems: domainProblems.length,
              completedProblems: completedCount,
              percentage: domainProblems.length > 0 ? Math.round((completedCount / domainProblems.length) * 100) : 0,
            };
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

      getDomainProgress: (domain) => {
        return (
          get().progress.domainProgress[domain] ?? {
            totalProblems: 0,
            completedProblems: 0,
            percentage: 0,
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
          const problems = getAllK8sProblems();

          for (const domain of DOMAINS) {
            const domainProblems = problems.filter((p) => p.domain === domain);
            const completedCount = domainProblems.filter(
              (p) => updated.completedProblems[p.id]?.status === 'completed'
            ).length;

            updated.domainProgress[domain] = {
              ...updated.domainProgress[domain],
              totalProblems: domainProblems.length,
              completedProblems: completedCount,
              percentage: domainProblems.length > 0 ? Math.round((completedCount / domainProblems.length) * 100) : 0,
            };
          }

          return { progress: updated };
        });
      },
    }),
    { name: 'k8s-lab-progress' }
  )
);
