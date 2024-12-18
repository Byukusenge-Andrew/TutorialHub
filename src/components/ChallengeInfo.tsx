import React from 'react';
import { Clock, HardDrive } from 'lucide-react';
import { DSAChallenge } from '../types';

interface ChallengeInfoProps {
  challenge: DSAChallenge;
}

export function ChallengeInfo({ challenge }: ChallengeInfoProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-2">{challenge.title}</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-4">{challenge.description}</p>
      
      <div className="flex flex-wrap gap-4 mb-4">
        <span className={`px-2 py-1 rounded-full text-sm ${
          challenge.difficulty === 'easy' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
          challenge.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
          'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
        }`}>
          {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
        </span>
        {challenge.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 rounded-full text-sm"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>Time Limit: {challenge.timeLimit / 1000}s</span>
        </div>
        <div className="flex items-center gap-1">
          <HardDrive className="w-4 h-4" />
          <span>Memory Limit: {challenge.memoryLimit}MB</span>
        </div>
        <div>
          Success Rate: {challenge.successRate}% ({challenge.successfulSubmissions}/{challenge.submissions} submissions)
        </div>
      </div>
    </div>
  );
}