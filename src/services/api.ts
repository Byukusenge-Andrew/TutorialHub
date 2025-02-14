import { User } from '@/types/auth';
import { Tutorial, Progress, DSAChallenge, TutorialProgress, Section, TutorialResponse } from '@/types';
import { create } from 'domain';
import axios from 'axios';
import { Post } from '@/types/community';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

interface ApiResponse<T> {
  status: string;
  data: T;
}

interface TypingHistoryResponse {
  data: {
    wpm: number;
    accuracy: number;
    date: string;
  }[];
}

const handleResponse = async <T>(response: Response): Promise<T> => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

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
      const response = await axios.get('/api/tutorials');
      return response.data;
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
    saveResult: async (data: {
      wpm: number,
      accuracy: number, 
      duration: number,
      characters: number,
      errors: number
    }) => {
      const response = await fetch(`${API_URL}/typing/results`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      return handleResponse<{status: string, data: any}>(response);
    },

    getHistory: async () => {
      const response = await fetch(`${API_URL}/typing/history`, {
        headers: getAuthHeader()
      });
      return handleResponse<{
        history: Array<{
          wpm: number,
          accuracy: number,
          date: string,
          duration: number
        }>,
        stats: {
          avgWpm: number,
          avgAccuracy: number,
          bestWpm: number,
          totalTests: number
        }
      }>(response);
    },

    getAdminStats: async () => {
      const response = await fetch(`${API_URL}/typing/admin/stats`, {
        headers: getAuthHeader()
      });
      return handleResponse(response);
    },

    getLeaderboard: async () => {
      const response = await fetch(`${API_URL}/typing/leaderboard`, {
        headers: getAuthHeader()
      });
      return handleResponse(response);
    },

    getUserHistory: async () => {
      const response = await fetch(`${API_URL}/typing/history`, {
        headers: getAuthHeader()
      });
      return handleResponse(response);
    },

    getDashboardStats: async () => {
      const response = await fetch(`${API_URL}/typing/dashboard-stats`, {
        headers: getAuthHeader()
      });
      return handleResponse(response);
    }
  },

  dsa: {
    getChallenges: async (filters?: { difficulty?: string; category?: string; tag?: string }) => {
      const params = new URLSearchParams(filters);
      const response = await fetch(`${API_URL}/dsa/challenges?${params}`);
      const data = await handleResponse<{ data: any }>(response);
      return data.data;
    },

    getChallenge: async (id: string) => {
      const response = await fetch(`${API_URL}/dsa/challenges/${id}`);
      const data = await handleResponse<{ data: any }>(response);
      return data.data;
    },

    submitSolution: async (id: string, code: string, language: string) => {
      const response = await fetch(`${API_URL}/dsa/challenges/${id}/submit`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code, language })
      });
      return handleResponse(response);
    },

    createChallenge: async (data: {
      title: string;
      description: string;
      difficulty: string;
      category: string;
      tags: string[];
      starterCode: {
        javascript: string;
        typescript: string;
        python: string;
      };
      testCases: {
        input: any;
        output: any;
        explanation?: string;
        isHidden?: boolean;
      }[];
    }) => {
      const response = await fetch(`${API_URL}/dsa/challenges`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    }
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
  },

  community: {
    getPosts: async () => {
      const response = await fetch(`${API_URL}/community/posts`, {
        headers: getAuthHeader(),
      });
      return handleResponse<{ status: string; data: Post[] }>(response);
    },

    getPost: async (id: string) => {
      const response = await fetch(`${API_URL}/community/posts/${id}`, {
        headers: getAuthHeader(),
      });
      return handleResponse<{ status: string; data: Post }>(response);
    },

    createPost: async (data: { title: string; content: string; tags: string[] }) => {
      const response = await fetch(`${API_URL}/community/posts`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return handleResponse<{ status: string; data: Post }>(response);
    },

    addComment: async (postId: string, content: string) => {
      const response = await fetch(`${API_URL}/community/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });
      return handleResponse(response);
    },

    likePost: async (postId: string) => {
      const response = await fetch(`${API_URL}/community/posts/${postId}/like`, {
        method: 'POST',
        headers: getAuthHeader(),
      });
      return handleResponse(response);
    },
  },

  dashboard: {
    getStats: async () => {
      const response = await fetch(`${API_URL}/dashboard/stats`, {
        headers: getAuthHeader()
      });
      return handleResponse(response);
    },

    getStudentStats: async () => {
      const response = await fetch(`${API_URL}/dashboard/student-stats`, {
        headers: getAuthHeader()
      });
      return handleResponse(response);
    }
  },
};

const progress = {
  getAllProgress: async () => {
    const response = await axios.get('/api/progress');
    return response.data;
  },
};