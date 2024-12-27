import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ThemeToggle } from './components/ThemeToggle.js';
import { ThemeProvider } from './components/ThemeProvider';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
      {/* Theme Toggle Button (Always Visible) */}
      <div className="fixed top-24 right-4 z-50"
      title='theme toggle'
      >
        <ThemeToggle />
      </div>
    </ThemeProvider>
  </StrictMode>
);