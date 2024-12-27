import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock } from 'lucide-react';
import { Tutorial } from '../types';
import { formatDate } from '../lib/utils';

interface TutorialCardProps {
  tutorial: Tutorial;

}

export function TutorialCard({ tutorial }: TutorialCardProps) {
  console.log("tutorila in card", tutorial)
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-900 dark:text- ">
      <div className="p-6 dark:text-white">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold">{tutorial.title}</h3>
          <div className="flex items-center text-yellow-500">
            <Star className="h-5 w-5 fill-current" />
            <span className="ml-1 text-gray-700">{tutorial.rating.toFixed(1)}</span>
          </div>
        </div>
        <p className="text-gray-600 mb-4">{tutorial.description}</p>
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <Clock className="h-4 w-4 mr-1" />
          <span>{formatDate(tutorial.createdAt)}</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {tutorial.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
        <Link
          to={`/tutorials/${tutorial._id}`}
          className="inline-block text-blue-600 hover:text-blue-800 font-medium"
        >
          View Tutorial →
        </Link>
      </div>
    </div>
  );
}