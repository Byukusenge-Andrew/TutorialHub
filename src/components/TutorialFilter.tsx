import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '../lib/utils';

interface TutorialFilterProps {
  categories: string[];
  selectedCategory: string;
  searchQuery: string;
  onCategoryChange: (category: string) => void;
  onSearchChange: (query: string) => void;
}

export function TutorialFilter({
  categories,
  selectedCategory,
  searchQuery,
  onCategoryChange,
  onSearchChange,
}: TutorialFilterProps) {
  return (
    <div className="space-y-4 mb-8">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search tutorials..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategoryChange('')}
          className={cn(
            'px-4 py-2 rounded-md',
            selectedCategory === ''
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          )}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={cn(
              'px-4 py-2 rounded-md',
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}