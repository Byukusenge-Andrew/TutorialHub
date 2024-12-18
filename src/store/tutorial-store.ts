import { create } from 'zustand';
import { Tutorial, TutorialProgress } from '../types';
import { useAuthStore } from '../store/auth-store';


interface TutorialState {
  tutorials: Tutorial[];
  progress: Record<string, TutorialProgress>;
  addTutorial: (tutorial: Tutorial) => void;
  updateProgress: (tutorialId: string, progress: number) => void;
  markSectionComplete: (tutorialId: string, sectionId: string) => void;
}

export const useTutorialStore = create<TutorialState>((set) => ({

  tutorials: [],
  progress: {},
  addTutorial: (tutorial) =>
    set((state) => ({
      tutorials: [...state.tutorials, tutorial],
    })),
  updateProgress: (tutorialId, progress) =>
    set((state) => ({
      
      progress: {
        ...state.progress,
        [tutorialId]: {
          ...state.progress[tutorialId],
          tutorialId,
          userId: useAuthStore.getState().user?.id ?? '0',// Replace with actual user ID
          progress,
          lastAccessedAt: new Date().toISOString(),
          completedSections: [], 
        },
      },
    })),
  markSectionComplete: (tutorialId, sectionId) =>
    set((state) => {
      const currentProgress = state.progress[tutorialId] || {
        tutorialId,
        userId: useAuthStore.getState().user?.id ?? '0',// Replace with actual user ID
        progress: 0,
        completedSections: [],
        lastAccessedAt: new Date().toISOString(),
      };

      const completedSections = [...currentProgress.completedSections, sectionId];
      const progress = (completedSections.length / 5) * 100; // Assuming 5 sections 

      return {
        progress: {
          ...state.progress,
          [tutorialId]: {
            ...currentProgress,
            completedSections,
            progress,
            lastAccessedAt: new Date().toISOString(),
          },
        },
      };
    }),

   
}));