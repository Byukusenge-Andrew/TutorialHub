import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, BookOpenTextIcon, Code2, Keyboard, Menu, Users, X ,LucideLayoutDashboard, LayoutDashboard} from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/button';

export const Navigation = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="bg-background border-b border-border">
      <nav className="container mx-auto px-4 py-5 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 text-3xl text-blue-700">
          <BookOpenTextIcon className="h-6 w-6 mt-[6px]" />
          <span className="font-bold">TutorialHub</span>
        </Link>
          <div className='hidden md:flex items-center font-bold space-x-9'>
            {user !=null && (
          <Button className='bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-500'>
            
                  <LayoutDashboard className='w-4 h-4 mr-2 '/>
                  {user?.role === 'admin' ? (
                    <Link to="/admin">Dashboard</Link>
                  ):(
                    <Link to="/dashboard">Dashboard</Link>
                  ) }
                  
                  
                </Button>
              )}
                <Button className='bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-500'>
                  <BookOpen className='w-4 h-4 mr-2'/>
                  <Link to="/tutorials">Tutorials</Link>
                </Button>
                <Button className='bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-500'>
                  <Keyboard className='w-4 h-4 mr-2'/>
                  <Link to="/typing">Typing</Link>
                </Button>
                <Button className='bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-500'>
                  <Code2 className='w-4 h-4 mr-2'/>
                  <Link to="/dsa">DSA Exercises</Link>
                </Button>
                <Button className='bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-500'>
                  <Users className='w-4 h-4 mr-2'/>
                  <Link to="/community">Community</Link>
                </Button>
          </div>
        <div className="hidden md:flex font-bold space-x-6">

          {/* Right Section - Auth & Theme Toggle */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="relative group">
                  <Button variant={'outline'} onClick={() => setDropdownOpen(!dropdownOpen)} >
                    <span>{user?.name.charAt(0)}</span>
                  </Button>
                  {dropdownOpen && (
                    <div className="absolute mx-0 flex-1 p-2 right-0 bg-white rounded-md shadow-lg overflow-x-hidden">
                      <Button variant={'outline'} className='mb-2 bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-500'>
                        <Link to="/profile">Profile</Link>
                      </Button>
                      <Button
                        variant={'outline'}
                        onClick={logout}
                        className="hover:bg-red-800"
                      >
                        Logout
                      </Button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Button className='bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-500'>
                  <Link to="/login">
                    Login
                  </Link>
                </Button>
                <Button className='bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-500'>
                  <Link
                    to="/register"
                  >
                    Register
                  </Link>
                </Button>
              </>
            )}
          </div>
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
            {/* Middle Section - Navigation Links */}
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

            {/* Right Section - Auth & Theme Toggle */}
            <div className="space-y-2">
              <ThemeToggle />
              {isAuthenticated ? (
                <>
                  <Button>
                    <Link
                      to="/dashboard"
                      onClick={() => setMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </Button>
                  <Button>
                    <Link
                      to="/tutorials"
                      onClick={() => setMenuOpen(false)}
                    >
                      Tutorials
                    </Link>
                  </Button>
                  <Button>
                    <Link
                      to="/typing"
                      onClick={() => setMenuOpen(false)}
                    >
                      Typing
                    </Link>
                  </Button>
                  <Button>
                    <Link
                      to="/community"
                      onClick={() => setMenuOpen(false)}
                    >
                      Community
                    </Link>
                  </Button>
                  {user?.role === 'admin' && (
                    <Button>
                      <Link
                        to="/admin"
                        onClick={() => setMenuOpen(false)}
                      >
                        Admin
                      </Link>
                    </Button>
                  )}
                  <Button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="hover:bg-red-800"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
