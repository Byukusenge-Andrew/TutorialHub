import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeToggle } from './components/ThemeToggle.js';
import { ThemeProvider } from './components/ThemeProvider';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <App />
          {/* Theme Toggle Button (Always Visible) */}
          <div className="fixed bottom-24 right-16  z-50"
          title='theme toggle'
          >
            <ThemeToggle />
          </div>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);