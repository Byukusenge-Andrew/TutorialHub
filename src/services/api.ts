import { User } from '@/types/auth';
import { Tutorial, Progress, DSAChallenge, TutorialProgress, Section, TutorialResponse } from '@/types';
import { create } from 'domain';
import axios from 'axios';
import { Post } from '@/types/community';
import { DSAExercise, SubmissionResult } from '@/types/dsa';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Add a debug log to verify the URL
console.log('API URL:', API_URL);

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

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

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
        headers: getAuthHeaders() as HeadersInit,
      });
      return handleResponse<{ user: User }>(response);
    },
  },

  tutorials: {
    getAll: async () => {
      try {
        const response = await axios.get(`${API_URL}/tutorials/getall`, {
          headers: getAuthHeaders() as any
        });
        console.log('Tutorials response:', response);
        return response.data;
      } catch (error) {
        console.error('Error fetching tutorials:', error);
        // Return empty data to prevent UI errors
        return { status: 'error', data: { tutorials: [] } };
      }
    },

    getTutorial: async (id: string) => {
      if (!id) throw new Error('Tutorial ID is required');
      const response = await fetch(`${API_URL}/tutorials/${id}`, {
        headers: getAuthHeaders() as HeadersInit
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
          ...getAuthHeaders(),
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
          headers: getAuthHeaders()
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
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        } as HeadersInit,
        body: JSON.stringify(tutorialData),
      });
      return handleResponse<Tutorial>(response);
    },

    delete: async (id: string) => {
      const response = await fetch(`${API_URL}/tutorials/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders() as HeadersInit,
      });
      return handleResponse<{ success: boolean }>(response);
    },

    getCategories: async () => {
      const response = await fetch(`${API_URL}/tutorials/categories`, {
        headers: getAuthHeaders() as HeadersInit,
      });
      return handleResponse<string[]>(response);
    },

    getUserProgress: async () => {
      try {
        const response = await axios.get(`${API_URL}/tutorials/progress`, {
          headers: getAuthHeaders() as any
        });
        return response.data;
      } catch (error) {
        console.error('Error fetching user progress:', error);
        // Return default data to prevent dashboard errors
        return { completed: 0, inProgress: 0 };
      }
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
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        } as HeadersInit,
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
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        } as HeadersInit,
        body: JSON.stringify(data)
      });
      return handleResponse<{status: string, data: any}>(response);
    },
    
    getHistory: async () => {
      try {
        const response = await axios.get(`${API_URL}/typing/history`, {
          headers: getAuthHeaders() as any
        });
        return response.data;
      } catch (error) {
        console.error('Error fetching typing history:', error);
        // Return default data to prevent dashboard errors
        return { history: [] };
      }
    },

    getAdminStats: async () => {
      const response = await fetch(`${API_URL}/typing/admin/stats`, {
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    },

    getLeaderboard: async () => {
      try {
        const response = await fetch(`${API_URL}/typing/leaderboard`, {
          headers: getAuthHeaders()
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard');
        }

        const data = await handleResponse<{
          status: string;
          data: any[];
        }>(response);

        return data.data; // Return the array directly
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return []; // Return empty array on error
      }
    },

    getUserHistory: async () => {
      try {
        const response = await fetch(`${API_URL}/typing/history`, {
          headers: getAuthHeaders()
        });
        
        if (!response.ok) {
          // Return empty data structure on auth error
          if (response.status === 401) {
            console.log('User not authenticated, returning empty history');
            return {
              history: [],
              stats: {
                bestScore: 0,
                totalTests: 0,
                avgAccuracy: 0
              }
            };
          }
          throw new Error('Failed to fetch user history');
        }
        
        return handleResponse<TypingHistoryResponse>(response).then(data => data.data);
      } catch (error) {
        console.error('Error fetching user history:', error);
        // Return empty data structure on error
        return {
          history: [],
          stats: {
            bestScore: 0,
            totalTests: 0,
            avgAccuracy: 0
          }
        };
      }
    },

    getDashboardStats: async () => {
      const response = await fetch(`${API_URL}/typing/dashboard-stats`, {
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    }
  },

  dsa: {
    getChallenges: async (filters?: { difficulty?: string; category?: string; tag?: string }) => {
      const params = new URLSearchParams(filters);
      const response = await fetch(`${API_URL}/dsa/getall?${params}`);
      const data = await handleResponse<{ data: any }>(response);
      return data.data;
    },

    getChallenge: async (id: string) => {
      const response = await fetch(`${API_URL}/dsa/challenges/${id}`);
      const data = await handleResponse<{ data: any }>(response);
      return data.data;
    },

    submitSolution: async (id: string, code: string, language: string) => {
      const response = await fetch(`${API_URL}/dsa/exercises/${id}/submit`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        } as HeadersInit,
        body: JSON.stringify({ code, language })
      });
      return handleResponse<SubmissionResult>(response);
    },

    getExercises: async (difficulty?: string | null, category?: string | null) => {
      const params = new URLSearchParams();
      if (difficulty) params.append('difficulty', difficulty);
      if (category) params.append('category', category);
      
      const queryString = params.toString() ? `?${params.toString()}` : '';
      const response = await fetch(`${API_URL}/dsa/exercises${queryString}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    getExercise: async (id: string) => {
      const response = await fetch(`${API_URL}/dsa/exercises/${id}`, {
        headers: getAuthHeaders() as HeadersInit
      });
      return handleResponse<DSAExercise>(response);
    },

    createChallenge: async (challenge: any) => {
      const response = await fetch('/api/dsa/challengescreate', {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(challenge)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create challenge');
      }
      
      return response.json();
    },

    getUserStats: async () => {
      const response = await fetch(`${API_URL}/dsa/user-stats`, {
        headers: getAuthHeaders() as HeadersInit
      });
      return handleResponse<any>(response);
    },

    testSolution: async (solution: string, input: string) => {
      const response = await fetch('/api/dsa/test-solution', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ solution, input }),
      });
      return response.json();
    },
  },

  admin: {
    getStats: async () => {
      try {
        // First try to get data from the API
        const response = await fetch(`${API_URL}/admin/stats`, {
          headers: getAuthHeaders()
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return handleResponse(response).then(data => {
          // Add type assertion or validation
          if (data && typeof data === 'object' && 'data' in data) {
            return data.data;
          }
          throw new Error('Invalid response format');
        });
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        
        // For development/demo purposes, return mock data when the API is unavailable
        console.log('Returning mock admin stats data');
        return {
          totalUsers: 125,
          totalTutorials: 42,
          totalCompletions: 78,
          activeUsers: 63,
          completionRate: '65%'
        };
      }
    },
    getUsers: async () => {
      const response = await fetch(`${API_URL}/admin/users`, {
        headers: getAuthHeaders()
      });
      const data = await handleResponse(response);
      return data;
    },
    deleteUser: async (userId: string) => {
      const response = await fetch(`${API_URL}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    },
    getAnalytics: async () => {
      const response = await fetch(`${API_URL}/admin/analytics`, {
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    },
  },
  progress:{
    getProgress: async (userId: string) => {
      try {
        const response = await fetch(`${API_URL}/progress/${userId}`, {
          headers: getAuthHeaders() as HeadersInit,
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
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        } as HeadersInit,
        body: JSON.stringify({ completedSection }),
      });
      return handleResponse<{ progress: any }>(response);
    },

    getAllProgress: async () => {
      const response = await fetch(`${API_URL}/progress`, {
        headers: getAuthHeaders(),
      });
      return handleResponse<{ progress: any[] }>(response);
    },
  },

  community: {
    getPosts: async () => {
      try {
        const response = await fetch(`${API_URL}/community/posts`, {
          headers: getAuthHeaders(),
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
        headers: getAuthHeaders(),
      });
      return handleResponse<{ status: string; data: Post }>(response);
    },

    createPost: async (data: { title: string; content: string; tags: string[] }) => {
      try {
        const response = await fetch(`${API_URL}/community/posts`, {
          method: 'POST',
          headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json',
          } as HeadersInit,
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
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        } as HeadersInit,
        body: JSON.stringify({ content }),
      });
      return handleResponse(response);
    },

    likePost: async (postId: string) => {
      const response = await fetch(`${API_URL}/community/posts/${postId}/like`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },
  },

  dashboard: {
    getStats: async () => {
      const response = await fetch(`${API_URL}/dashboard/stats`, {
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    },

    getStudentStats: async (): Promise<any> => {
      try {
        const response = await fetch(`${API_URL}/dashboard/student-stats`, {
          headers: getAuthHeaders()
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await handleResponse<{ status: string; data: any }>(response);
        return data.data;
      } catch (error) {
        console.error('Error fetching student stats:', error);
        // Return default data to prevent dashboard errors
        return {
          tutorials: { completed: 0, inProgress: 0 },
          typing: { avgWpm: 0, avgAccuracy: 0, bestWpm: 0, totalTests: 0 },
          dsa: { solved: 0, totalAttempted: 0, successRate: 0 },
          community: { posts: 0, comments: 0 }
        };
      }
    }
  },
};

const progress = {
  getAllProgress: async () => {
    const response = await axios.get('/api/progress');
    return response.data;
  },
};