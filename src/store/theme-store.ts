import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const updateDocumentClass = (theme: 'light' | 'dark') => {
  const root = window.document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(theme);
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      resolvedTheme: getSystemTheme(),
      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === 'system' 
          ? (getSystemTheme() === 'light' ? 'dark' : 'light')
          : (currentTheme === 'light' ? 'dark' : 'light');
        
        set({ theme: newTheme });
        updateDocumentClass(newTheme);
      },
      setTheme: (theme) => {
        const resolvedTheme = theme === 'system' ? getSystemTheme() : theme;
        set({ theme, resolvedTheme });
        updateDocumentClass(resolvedTheme);
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          const resolvedTheme = state.theme === 'system' ? getSystemTheme() : state.theme;
          updateDocumentClass(resolvedTheme);
          
          // Listen for system theme changes
          if (typeof window !== 'undefined') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
              if (state.theme === 'system') {
                const newTheme = e.matches ? 'dark' : 'light';
                state.setTheme('system');
              }
            });
          }
        }
      },
    }
  )
);