import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '@/services/api';
import { DSAExercise } from '@/types/dsa';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';

// Add this near the top of your file, after the imports
// This extends the existing DSAExercise type with the _id property
type DSAExerciseWithId = DSAExercise & { _id: string };

export function DSAExercises() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery<DSAExerciseWithId[], Error>({
    queryKey: ['dsa-exercises', difficulty, category],
    queryFn: async () => {
      const result = await api.dsa.getExercises(difficulty, category);
      return result as DSAExerciseWithId[];
    },
  });

  // Ensure exercises is always an array
  const exercises: DSAExerciseWithId[] = Array.isArray(data) ? data : [];
  
  // Now filter will work because exercises is guaranteed to be an array
  const filteredExercises = exercises.filter((exercise) => {
    // Apply difficulty filter
    if (difficulty && exercise.difficulty !== difficulty) return false;
    // Apply category filter
    if (category && exercise.category !== category) return false;
    // Apply search filter (case insensitive)
    if (search && !exercise.title.toLowerCase().includes(search.toLowerCase()) && 
        !exercise.description.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  const categories = [...new Set(exercises.map(e => e.category) || [])];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return <div>Error loading exercises: {error.message}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">DSA Exercises</h1>
        {
          user?.role == "admin" && (
            <Button variant="default" asChild>
              <Link to="/dsa/create">Create Exercise</Link>
            </Button>
          )
        }
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search exercises..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className=''>
          <select 
            className="border rounded p-2"
            value={difficulty || ''}
            onChange={(e) => setDifficulty(e.target.value || null)}
          >
            <option value="">Difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div>
          <select 
            className="border rounded p-2"
            value={category || ''}
            onChange={(e) => setCategory(e.target.value || null)}
          >
            <option value="">Category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Exercise Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.map((exercise) => (
          <Link key={exercise._id?.toString()} to={`/dsa/${exercise._id}`}>
            <Card className="hover:shadow-lg transition-shadow h-full">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{exercise.title}</CardTitle>
                  <Badge variant={
                    exercise.difficulty === 'easy' ? 'success' :
                    exercise.difficulty === 'medium' ? 'warning' : 'destructive'
                  }>
                    {exercise.difficulty}
                  </Badge>
                </div>
                <CardDescription className="text-sm text-muted-foreground">
                  {exercise.category}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm line-clamp-2">{exercise.description}</p>
                <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                  <span>{exercise.testCases.length} Test Cases</span>
                  <span>Success Rate: {exercise.successRate || 0}%</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No exercises found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 'success';
    case 'medium':
      return 'warning';
    case 'hard':
      return 'destructive';
    default:
      return 'default';
  }
}