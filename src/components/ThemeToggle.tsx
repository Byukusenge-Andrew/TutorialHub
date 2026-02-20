import { Moon, Sun, Laptop } from 'lucide-react';
import { useThemeStore } from '../store/theme-store';
import { useState, useRef, useEffect } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4 transition-transform duration-300 rotate-0" />;
      case 'dark':
        return <Moon className="h-4 w-4 transition-transform duration-300 rotate-0" />;
      default:
        return <Laptop className="h-4 w-4 transition-transform duration-300 rotate-0" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-full transition-all duration-300 ease-in-out ${
          theme === 'dark'
            ? 'bg-slate-800 text-slate-100 hover:bg-slate-700'
            : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent`}
        aria-label="Toggle theme"
      >
        <div className="w-5 h-5 flex items-center justify-center">
          {getIcon()}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 rounded-lg shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <button
              onClick={() => { setTheme('light'); setIsOpen(false); }}
              className={`w-full px-4 py-2 text-sm text-left hover:bg-slate-100 dark:hover:bg-slate-700 ${
                theme === 'light' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-slate-100'
              }`}
              role="menuitem"
            >
              <Sun className="inline-block w-4 h-4 mr-2" />
              Light
            </button>
            <button
              onClick={() => { setTheme('dark'); setIsOpen(false); }}
              className={`w-full px-4 py-2 text-sm text-left hover:bg-slate-100 dark:hover:bg-slate-700 ${
                theme === 'dark' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-slate-100'
              }`}
              role="menuitem"
            >
              <Moon className="inline-block w-4 h-4 mr-2" />
              Dark
            </button>
            <button
              onClick={() => { setTheme('system'); setIsOpen(false); }}
              className={`w-full px-4 py-2 text-sm text-left hover:bg-slate-100 dark:hover:bg-slate-700 ${
                theme === 'system' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-slate-100'
              }`}
              role="menuitem"
            >
              <Laptop className="inline-block w-4 h-4 mr-2" />
              System
            </button>
          </div>
        </div>
      )}
    </div>
  );
}