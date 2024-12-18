import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TypingStats } from '../lib/typing-utils';

interface TypingState {
  stats: TypingStats | null;
  history: TypingStats[];
  updateStats: (stats: TypingStats) => void;
}

export const useTypingStore = create<TypingState>()(
  persist(
    (set) => ({
      stats: null,
      history: [],
      updateStats: (stats) =>
        set((state) => ({
          stats,
          history: [...state.history, stats].slice(-10), // Keep last 10 attempts
        })),
    }),
    {
      name: 'typing-storage',
    }
  )
);