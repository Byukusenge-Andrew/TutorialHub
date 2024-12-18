import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, BookOpen, Star } from 'lucide-react';
import { useAuthStore } from '../store/auth-store';

export function Profile() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="flex items-center space-x-4 mb-8">
          <div className="bg-blue-100 p-4 rounded-full">
            <User className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-600">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="ml-auto flex items-center space-x-2 text-red-600 hover:text-red-800"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold">Your Progress</h2>
            </div>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-md shadow-sm">
                <h3 className="font-medium mb-2">React Fundamentals</h3>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full w-2/3"></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">12 of 15 lessons completed</p>
              </div>
              <div className="bg-white p-4 rounded-md shadow-sm">
                <h3 className="font-medium mb-2">TypeScript Basics</h3>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full w-1/3"></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">4 of 12 lessons completed</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center space-x-2 mb-4">
              <Star className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold">Your Achievements</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-md shadow-sm text-center">
                <div className="bg-yellow-100 p-2 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="font-medium">Quick Learner</h3>
                <p className="text-sm text-gray-600">Completed 5 tutorials</p>
              </div>
              <div className="bg-white p-4 rounded-md shadow-sm text-center">
                <div className="bg-blue-100 p-2 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-medium">Knowledge Seeker</h3>
                <p className="text-sm text-gray-600">Joined 3 courses</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}