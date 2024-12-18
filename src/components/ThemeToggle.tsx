import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../store/theme-store';

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
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