import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, AuthState } from '@/types/auth';
import { redirect } from 'react-router-dom';

interface AuthStore extends AuthState {
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (isLoading: boolean) => void;
 

  
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      login: (user: User, token: string) => {
        console.log('Setting auth state:', { user, token });
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      },
      logout: () => {
        console.log('Clearing auth state');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
        redirect('/');
      },
      setLoading: (isLoading: boolean) => set({ isLoading }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);