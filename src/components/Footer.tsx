import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export function Footer() {
  return (
    <footer className="dark:bg-gray-900 bg-blue-600 text-white rounded">
      <div className="container mx-auto px-8 py-[14px]">
        <div className="flex flex-col md:flex-row justify-between items-center">
        
             <Link to="/" className="flex items-center space-x-2 mb-4 md:mb-4">
                        <BookOpen className="h-6 w-6 text-white" />
                        <span className="font-bold text-xl">TutorialHub</span>
                      </Link>
          
          <div className="flex space-x-6 md:mx-16">
            <a href="#" className="hover:text-blue-400">About</a>
            <a href="#" className="hover:text-blue-400">Contact</a>
            <a href="#" className="hover:text-blue-400">Terms</a>
            <a href="#" className="hover:text-blue-400">Privacy</a>
          </div>
        </div>
        <div className="mt-8 text-center text-white">
          <p>&copy; {new Date().getFullYear()} TutorialHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}