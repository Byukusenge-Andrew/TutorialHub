import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../store/theme-store';

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className={`p-4 rounded-[30px] ${
        theme === 'light'
          ? 'bg-black text-white hover:bg-slate-500'
          : 'bg-white text-black hover:bg-slate-500'
      }`}
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