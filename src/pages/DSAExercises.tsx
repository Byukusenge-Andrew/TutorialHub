import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Plus } from 'lucide-react';
import { useAuthStore } from '../store/auth-store';
import { api } from '@/services/api';
import { DSAChallenge } from '@/types';

export function DSAExercises() {
  const [searchQuery, setSearchQuery] = useState('');
  const [difficulty, setDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [challenges, setChallenges] = useState<DSAChallenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const loadChallenges = async () => {
      try {
        setIsLoading(true);
        const response = await api.dsa.getChallenges();
        setChallenges(response.data?.challenges || []);
      } catch (error) {
        console.error('Failed to load challenges:', error);
        setChallenges([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadChallenges();
  }, []);

  const filteredChallenges = challenges.filter((challenge: DSAChallenge) => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      challenge.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficulty === 'all' || challenge.difficulty === difficulty;
    return matchesSearch && matchesDifficulty;
  });

  console.log(filteredChallenges);
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">DSA Challenges</h1>
        {user?.role === 'admin' && (
          <Link
            to="/dsa/create"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Challenge
          </Link>
        )}
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search challenges..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
          />
        </div>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
        >
          <option value="all">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <div className="grid gap-6">
        {filteredChallenges.map((challenge) => (
          <Link
            key={challenge._id}
            to={`/dsa/${challenge._id}`}
            className="block bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">{challenge.title}</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {challenge.description}
                </p>
                <div className="flex items-center space-x-4">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    challenge.difficulty === 'easy' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                    challenge.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                    'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                  }`}>
                    {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Success Rate: {challenge.successRate}%
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {challenge.tags.map((tag, index) => (
                  <span
                    key={`${challenge._id}-${tag}-${index}`}
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}