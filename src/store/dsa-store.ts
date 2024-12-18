import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DSAChallenge, TestCase } from '../types';

interface DSAState {
  challenges: DSAChallenge[];
  addChallenge: (challenge: DSAChallenge) => void;
  updateChallenge: (id: string, challenge: Partial<DSAChallenge>) => void;
  deleteChallenge: (id: string) => void;
  submitSolution: (challengeId: string, solution: string) => Promise<boolean>;
}

export const useDSAStore = create<DSAState>()(
  persist(
    (set, get) => ({
      challenges: [],
      addChallenge: (challenge) =>
        set((state) => ({
          challenges: [...state.challenges, challenge],
        })),
      updateChallenge: (id, challenge) =>
        set((state) => ({
          challenges: state.challenges.map((c) =>
            c._id === id ? { ...c, ...challenge } : c
          ),
        })),
      deleteChallenge: (id) =>
        set((state) => ({
          challenges: state.challenges.filter((c) => c._id !== id),
        })),
      submitSolution: async (challengeId, solution) => {
        const challenge = get().challenges.find((c) => c._id === challengeId);
        if (!challenge) return false;

    
        try {
          const fn = new Function('input', solution);
          const passed = challenge.testCases.every((testCase) => {
            const result = fn(testCase.input);
            return JSON.stringify(result) === JSON.stringify(testCase.output);
          });

          if (passed) {
            set((state) => ({
              challenges: state.challenges.map((c) =>
                c._id === challengeId
                  ? {
                      ...c,
                      submissions: c.submissions + 1,
                      successfulSubmissions: c.successfulSubmissions + 1,
                    }
                  : c
              ),
            }));
          } else {
            set((state) => ({
              challenges: state.challenges.map((c) =>
                c._id === challengeId
                  ? { ...c, submissions: c.submissions + 1 }
                  : c
              ),
            }));
          }

          return passed;
        } catch (error) {
          console.error('Error executing solution:', error);
          return false;
        }
      },
    }),
    {
      name: 'dsa-storage',
    }
  )
);