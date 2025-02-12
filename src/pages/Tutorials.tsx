import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { BookOpen, Clock, User } from 'lucide-react';

interface Tutorial {
  _id: string;
  title: string;
  description: string;
  content: string;
  authorId: {
    name: string;
    _id: string;
  };
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  createdAt: string;
}

export function Tutorials() {
  const { data: tutorials, isLoading, error } = useQuery<Tutorial[]>({
    queryKey: ['tutorials'],
    queryFn: () => api.tutorials.getAll()
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Error loading tutorials. Please try again later.</p>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-500 bg-green-500/10';
      case 'intermediate':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'advanced':
        return 'text-red-500 bg-red-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Programming Tutorials</h1>
        <div className="flex gap-4">
          {/* Add filters or search here if needed */}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutorials?.map((tutorial) => (
          <Link
            key={tutorial._id}
            to={`/tutorials/${tutorial._id}`}
            className="block bg-card hover:bg-card/80 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg border border-border"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2 text-foreground">
                {tutorial.title}
              </h2>
              <p className="text-muted-foreground mb-4 line-clamp-2">
                {tutorial.description}
              </p>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{tutorial.authorId.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{tutorial.estimatedTime} mins</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                    tutorial.difficulty
                  )}`}
                >
                  {tutorial.difficulty.charAt(0).toUpperCase() + tutorial.difficulty.slice(1)}
                </span>
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {tutorials?.length === 0 && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No tutorials available yet.</p>
        </div>
      )}
    </div>
  );
} 