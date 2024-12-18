import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, User, Code2, Timer } from 'lucide-react';
import { useAuthStore } from '../store/auth-store';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/button';

export function Navigation() {
  const { isAuthenticated, user, logout } = useAuthStore();

  return (
    <nav className="bg-background py-[8px] border-b border-border">
      <div className="container mx-auto px-5">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">TutorialHub</span>
          </Link>

          <div className="flex items-center space-x-5">
            <Link to="/tutorials" className="text-foreground hover:text-primary">
              Tutorials
            </Link>
            <Link to="/dsa" className="text-foreground hover:text-primary">
              DSA Exercises
            </Link>
            <ThemeToggle />
            {isAuthenticated && user ? (
              <div className="flex items-center gap-4">
                 <div className="text-foreground font-medium text-lg flex items-center gap-2">
              Welcome, <span className="font-bold">{user?.name[0]}</span>
            </div>
                <Button >
                  <Link to={user.role === 'admin' ? '/admin' : '/dashboard'}>
                    Dashboard
                  </Link>
                </Button>
                <Button onClick={logout}>Logout</Button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Button >
                  <Link to="/login">Login</Link>
                </Button>
                <Button >
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </nav>
  );
}