import React from 'react';
import { useTypingStore } from '../store/typing-store';

export function TypingStats() {
  const { stats } = useTypingStore();

  if (!stats) return null;

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="p-4 bg-secondary rounded-md text-center">
        <p className="text-sm text-foreground/60">WPM</p>
        <p className="text-2xl font-bold text-foreground">{stats.wpm}</p>
      </div>
      <div className="p-4 bg-secondary rounded-md text-center">
        <p className="text-sm text-foreground/60">Accuracy</p>
        <p className="text-2xl font-bold text-foreground">{stats.accuracy}%</p>
      </div>
      <div className="p-4 bg-secondary rounded-md text-center">
        <p className="text-sm text-foreground/60">Time</p>
        <p className="text-2xl font-bold text-foreground">{stats.time}s</p>
      </div>
    </div>
  );
}