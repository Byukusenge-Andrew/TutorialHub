import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { BookOpen, Code2, Keyboard, Users } from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuthStore();

  const navItems = [
    {
      label: 'Tutorials',
      icon: BookOpen,
      href: '/tutorials'
    },
    {
      label: 'Type',
      icon: Keyboard,
      href: '/typing'
    },
    {
      label: 'DSA Exercises',
      icon: Code2,
      href: '/dsa'
    }
  ];

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left section - Logo */}
          <Link to="/" className="text-xl font-bold">
            TutorialHub
          </Link>

          Middle section - Nav Links
          <div className="flex items-center justify-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right section - Auth & Theme */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {user ? (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
                <Button variant="outline" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button asChild>
                <Link to="/login">Login</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}