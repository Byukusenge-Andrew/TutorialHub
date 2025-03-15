import { Link } from 'react-router-dom';
import { Keyboard } from 'lucide-react';

export function MainNav() {
  return (
    <nav className="flex items-center space-x-4">
      <Link
        to="/typing"
        className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary"
      >
        <Keyboard className="h-4 w-4" />
        <span>Typing Practice</span>
      </Link>
    
    </nav>
  );
} 