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

interface TypingHistoryData {
  history: Array<{
    wpm: number;
    accuracy: number;
    date: string;
    duration: number;
  }>;
  stats: {
    avgWpm: number;
    avgAccuracy: number;
    bestWpm: number;
    totalTests: number;
  };
}

interface TypingHistoryResponse {
  status: string;
  data: {
    history: Array<{
      wpm: number;
      accuracy: number;
      date: string;
      duration: number;
    }>;
    stats: {
      avgWpm: number;
      avgAccuracy: number;
      bestWpm: number;
      totalTests: number;
    };
  };
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
      const response = await fetch(`${API_URL}/tutorials`, {
        headers: getAuthHeader()
      });
      return handleResponse<{
        status: string;
        data: {
          tutorials: Tutorial[];
        };
      }>(response);
    },

    getTutorial: async (id: string) => {
      if (!id) throw new Error('Tutorial ID is required');
      const response = await fetch(`${API_URL}/tutorials/${id}`, {
        headers: getAuthHeader()
      });
      return handleResponse<{
        status: string;
        data: {
          tutorial: Tutorial;
        };
      }>(response);
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

    getUserProgress: async () => {
      const response = await fetch(`${API_URL}/tutorials/progress`, {
        headers: getAuthHeader()
      });
      return handleResponse<{
        completed: number;
        inProgress: number;
        totalTime: number;
      }>(response);
    },
  },

  typing: {
    saveRecord: async (data: {
      wpm: number,
      accuracy: number, 
      duration: number,
      characters: number,
      errors: number
    }) => {
      const response = await fetch(`${API_URL}/typing/saveRecord`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      return handleResponse<{status: string, data: any}>(response);
    },

    savestatResult: async (data: {
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
      try {
        const response = await fetch(`${API_URL}/typing/history`, {
          headers: getAuthHeader()
        });

        if (!response.ok) {
          throw new Error('Failed to fetch typing history');
        }

        const result = await handleResponse<{
          status: string;
          data: {
            history: Array<{
              wpm: number;
              accuracy: number;
              score: number;
              date: string;
              duration: number;
            }>;
            stats: {
              bestScore: number;
              totalTests: number;
              avgAccuracy: number;
            };
          };
        }>(response);

        return result.data;
      } catch (error) {
        console.error('Error fetching typing history:', error);
        throw error;
      }
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

    getUserHistory: async (): Promise<TypingHistoryData> => {
      try {
        const response = await fetch(`${API_URL}/typing/history`, {
          headers: getAuthHeader()
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch user history');
        }

        const result = await handleResponse<{
          status: string;
          data: TypingHistoryData;
        }>(response);

        return result.data;
      } catch (error) {
        console.error('Error fetching user history:', error);
        throw error;
      }
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

    createChallenge: async (challenge: any) => {
      const response = await fetch('/api/dsa/challengescreate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(challenge),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create challenge');
      }
      
      return response.json();
    },

    getUserStats: async () => {
      const response = await fetch(`${API_URL}/dsa/user-stats`, {
        headers: getAuthHeader()
      });
      return handleResponse<{
        solved: number;
        totalAttempted: number;
        successRate: number;
      }>(response);
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
  },

  community: {
    getPosts: async () => {
      try {
        const response = await fetch(`${API_URL}/community/posts`, {
          headers: getAuthHeader(),
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }

        return handleResponse<{ status: string; data: Post[] }>(response);
      } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
      }
    },

    getPost: async (id: string) => {
      const response = await fetch(`${API_URL}/community/posts/${id}`, {
        headers: getAuthHeader(),
      });
      return handleResponse<{ status: string; data: Post }>(response);
    },

    createPost: async (data: { title: string; content: string; tags: string[] }) => {
      try {
        const response = await fetch(`${API_URL}/community/posts`, {
          method: 'POST',
          headers: {
            ...getAuthHeader(),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error('Failed to create post');
        }

        return handleResponse<{
          status: string;
          data: Post;
        }>(response);
      } catch (error) {
        console.error('Error creating post:', error);
        throw error;
      }
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

    getStudentStats: async (): Promise<any> => {
      const response = await fetch(`${API_URL}/dashboard/student-stats`, {
        headers: getAuthHeader()
      });
      const data = await handleResponse<{ status: string; data: any }>(response);
      return data.data;
    }
  },
};

const progress = {
  getAllProgress: async () => {
    const response = await axios.get('/api/progress');
    return response.data;
  },
};