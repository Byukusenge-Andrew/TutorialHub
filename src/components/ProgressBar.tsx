import React from 'react';
import { useTutorialStore } from '../store/tutorial-store';

interface ProgressBarProps {
  tutorialId: string;
}

export function ProgressBar({ tutorialId }: ProgressBarProps) {
  const progress = useTutorialStore((state) => state.progress[tutorialId]?.progress || 0);

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
      <div
        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}