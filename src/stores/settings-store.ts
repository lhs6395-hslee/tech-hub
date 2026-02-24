'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DbEngine } from '@/types/problem';

interface SettingsStore {
  dbEngine: DbEngine;
  setDbEngine: (engine: DbEngine) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      dbEngine: 'postgresql',
      setDbEngine: (dbEngine) => set({ dbEngine }),
    }),
    { name: 'sql-dba-settings' }
  )
);
