import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../store/theme-store';

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md bg-black text-white hover:text-black hover:bg-gray-100 dark:bg-white dark:text-black  dark:hover:bg-white/45"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </button>
  );
}