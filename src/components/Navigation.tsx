import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, BookOpenTextIcon, Menu, X } from 'lucide-react';
import { useAuthStore } from '../store/auth-store';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/button';

export function Navigation() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-background border-b border-border">
      <nav className="container mx-auto px-4 py-5 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 text-3xl text-primary">
          <BookOpenTextIcon className="h-6 w-6  mt-[6px]" />
          <span className="font-bold ">TutorialHub</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden   md:flex items-center font-bold space-x-6">
       
          <Link to="/tutorials" className="text-foreground hover:text-primary">
            Tutorials
          </Link>
          <Link to="/typing" className="text-foreground hover:text-primary">
            Type
          </Link>
          <Link to="/dsa" className="text-foreground hover:text-primary">
            DSA Exercises
          </Link>
    
          {isAuthenticated && user ? (
            <div className="flex items-center space-x-4">
              <Button>
                <Link to={user.role === 'admin' ? '/admin' : '/dashboard'}>
                  Dashboard
                </Link>
              </Button>
              <Button onClick={logout}>Logout</Button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Button>
                <Link to="/login">Login</Link>
              </Button>
              <Button>
                <Link to="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="p-4 space-y-2">
            <Link
              to="/tutorials"
              className="block text-foreground hover:text-primary"
              onClick={() => setMenuOpen(false)}
            >
              Tutorials
            </Link>
            <Link
              to="/typing"
              className="block text-foreground hover:text-primary"
              onClick={() => setMenuOpen(false)}
            >
              Type
            </Link>
            <Link
              to="/dsa"
              className="block text-foreground hover:text-primary"
              onClick={() => setMenuOpen(false)}
            >
              DSA Exercises
            </Link>
            {isAuthenticated && user ? (
              <div className="space-y-2">
                <Button>
                  <Link
                    to={user.role === 'admin' ? '/admin' : '/dashboard'}
                    onClick={() => setMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                </Button>
                <Button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Button>
                  <Link to="/login" onClick={() => setMenuOpen(false)}>
                    Login
                  </Link>
                </Button>
                <Button>
                  <Link to="/register" onClick={() => setMenuOpen(false)}>
                    Register
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
