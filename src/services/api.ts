import { User } from '@/types/auth';
import { Tutorial, Progress, DSAChallenge, TutorialProgress, Section, TutorialResponse } from '@/types';
import { create } from 'domain';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }
  return response.json();
}


function getAuthHeader(): HeadersInit {
  const token = localStorage.getItem('auth-storage')
    ? JSON.parse(localStorage.getItem('auth-storage')!).state.token
    : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  auth: {
    login: async (email: string, password: string) => {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await handleResponse<{ status: string; data: { user: User; token: string } }>(response);

      if (!data.data?.user) {
        throw new Error('Invalid response format');
      }

      return {
        user: data.data.user,
        token: data.data.token
      };
    },

    register: async (data: { name: string; email: string; password: string }) => {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleResponse<{ user: User; token: string }>(response);
    },

    validate: async () => {
      const response = await fetch(`${API_URL}/auth/validate`, {
        headers: getAuthHeader() as HeadersInit,
      });
      return handleResponse<{ user: User }>(response);
    },
  },

  tutorials: {
    getAll: async () => {
      try {
        const response = await fetch(`${API_URL}/tutorials`, {
          headers: getAuthHeader(),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: TutorialResponse = await response.json();
        return data.data.tutorials;
      } catch (error) {
        console.error('Failed to fetch tutorials:', error);
        return [];
      }
    },
     
    create: async (tutorialData: {
      title: string;
      description: string;
      category: string;
      tags: string[];
      sections: Section[];
      authorId: string;
    }) => {
      const response = await fetch(`${API_URL}/tutorials/create`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        } as HeadersInit,
        body: JSON.stringify(tutorialData),
      });
      return handleResponse<Tutorial>(response);
    },

    getById: async (id: string) => {
      try {
        const response = await fetch(`${API_URL}/tutorials/${id}`, {
          method: 'GET',
          headers: getAuthHeader()
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const data = await response.json();
        return data; // Return entire response structure
      } catch (error) {
        console.error('Error in getById:', error);
        throw error;
      }
    },

    update: async (id: string, tutorialData: Partial<Tutorial>) => {
      const response = await fetch(`${API_URL}/tutorials/${id}`, {
        method: 'PATCH',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        } as HeadersInit,
        body: JSON.stringify(tutorialData),
      });
      return handleResponse<Tutorial>(response);
    },

    delete: async (id: string) => {
      const response = await fetch(`${API_URL}/tutorials/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader() as HeadersInit,
      });
      return handleResponse<{ success: boolean }>(response);
    },

    getCategories: async () => {
      const response = await fetch(`${API_URL}/tutorials/categories`, {
        headers: getAuthHeader() as HeadersInit,
      });
      return handleResponse<string[]>(response);
    },
  },

  typing: {
    saveResult: async (stats: {
      wpm: number;
      accuracy: number;
      time: number;
      totalWords: number;
      errors: number;
    }) => {
      const response = await fetch(`${API_URL}/typing/results`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stats),
      });
      return handleResponse<{ success: boolean }>(response);
    },

    getHistory: async () => {
      const response = await fetch(`${API_URL}/typing/history`, {
        headers: { ...getAuthHeader() },
      });
      return handleResponse<{
        wpm: number;
        accuracy: number;
        time: number;
        date: string;
      }[]>(response);
    },
  },

  dsa: {
    createChallenge: async (challenge: DSAChallenge) => {
      try {	
        const response = await fetch(`${API_URL}/dsa/challenges`, {
          method: 'POST',
        headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(challenge),
        });
        return handleResponse<DSAChallenge>(response);
      } catch (error) {
        console.error('Failed to create challenge:', error);
        return { success: false, message: 'Failed to create challenge' };
      }
    },

    getChallenges: async () => {
      const response = await fetch(`${API_URL}/dsa/challenges`, {
        headers: getAuthHeader() as HeadersInit,
      });
      const data = await handleResponse<{
        status: string;
        data: { challenges: DSAChallenge[] }
      }>(response);
      return data;
    },

    submitSolution: async (challengeId: string, solution: string) => {
      const response = await fetch(`${API_URL}/dsa/challenges/${challengeId}/submit`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ solution }),
      });
      return handleResponse<{ success: boolean; results: any[] }>(response);
    },
  },

  admin: {
    getStats: async () => {
      const response = await fetch(`${API_URL}/admin/stats`, {
        headers: getAuthHeader() as HeadersInit,
      });
      return handleResponse<{
        totalTutorials: number;
        totalUsers: number;
        totalCompletions: number;
        activeUsers: number;
        completionRate: number;
      }>(response);
    },
  },
  progress:{
    getProgress: async (userId: string) => {
      try {
        const response = await fetch(`${API_URL}/progress/${userId}`, {
          headers: getAuthHeader() as HeadersInit,
        });
        return handleResponse<TutorialProgress>(response);
      } catch (error) {
        console.error('Error in getProgress:', error);
        throw error;
      }
    },
    updateProgress: async (tutorialId: string, completedSection: string) => {
      const response = await fetch(`${API_URL}/progress/${tutorialId}`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completedSection }),
      });
      return handleResponse<{ progress: any }>(response);
    },

    getAllProgress: async () => {
      const response = await fetch(`${API_URL}/progress`, {
        headers: getAuthHeader(),
      });
      return handleResponse<{ progress: any[] }>(response);
    },
  }
};

const progress = {
  getAllProgress: async () => {
    const response = await axios.get('/api/progress');
    return response.data;
  },
};