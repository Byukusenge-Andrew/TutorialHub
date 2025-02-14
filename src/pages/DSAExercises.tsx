import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Search, Filter, Code2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth-store';

interface DSAChallenge {
  _id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  tags: string[];
  successRate: number;
  totalSubmissions: number;
  authorId: {
    name: string;
  };
}

interface ChallengesResponse {
  status: string;
  data: {
    challenges: DSAChallenge[];
  };
}

export function DSAExercises() {
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { data: challenges, isLoading } = useQuery<DSAChallenge[]>({
    queryKey: ['dsa-challenges', selectedDifficulty, selectedCategory],
    queryFn: () => api.dsa.getChallenges({
      difficulty: selectedDifficulty === 'all' ? undefined : selectedDifficulty,
      category: selectedCategory === 'all' ? undefined : selectedCategory
    }),
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const categories = ['all', 'arrays', 'strings', 'linked-lists', 'trees', 'graphs', 'dynamic-programming'];
  const difficulties = ['all', 'easy', 'medium', 'hard'];

  const filteredChallenges = challenges?.filter(challenge => 
    challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    challenge.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500 bg-green-500/10';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10';
      case 'hard': return 'text-red-500 bg-red-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">DSA Challenges</h1>
        {user?.role === 'admin' && (
          <Button asChild>
            <Link to="/dsa/create" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Challenge
            </Link>
          </Button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="w-full md:w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search challenges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-4 py-2 border border-border rounded-md bg-background"
          >
            {difficulties.map(difficulty => (
              <option key={difficulty} value={difficulty}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-border rounded-md bg-background"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category.split('-').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredChallenges?.map((challenge) => (
          <Link
            key={challenge._id}
            to={`/dsa/${challenge._id}`}
            className="block bg-card hover:bg-card/80 rounded-lg p-6 shadow-md transition-all duration-200 border border-border"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">{challenge.title}</h2>
                <p className="text-muted-foreground line-clamp-2">
                  {challenge.description}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>By {challenge.authorId.name}</span>
                  <span>•</span>
                  <span>{challenge.totalSubmissions} submissions</span>
                  <span>•</span>
                  <span>{challenge.successRate.toFixed(1)}% success rate</span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                    challenge.difficulty
                  )}`}
                >
                  {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                </span>
                <div className="flex flex-wrap gap-2 justify-end">
                  {challenge.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredChallenges?.length === 0 && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No challenges found.</p>
        </div>
      )}
    </div>
  );
}