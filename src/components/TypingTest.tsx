import React, { useState, useEffect, useCallback } from 'react';
import { useTypingStore } from '../store/typing-store';
import { TypingStats } from './TypingStats';
import { TypingInput } from './TypingInput';
import { TypingPrompt } from './TypingPrompt';
import { calculateTypingStats } from '../lib/typing-utils';

const TIMER_DURATION = 60; // 60 seconds to complete

interface TypingTestProps {
  onComplete: (stats: {
    wpm: number;
    accuracy: number;
    time: number;
    totalWords: number;
    errors: number;
  }) => void;
}

export function TypingTest({ onComplete }: TypingTestProps) {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [startTime, setStartTime] = useState<number | null>(null);
  const { updateStats } = useTypingStore();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleComplete(false);
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  const handleStart = useCallback(() => {
    setIsActive(true);
    setStartTime(Date.now());
    setTimeLeft(TIMER_DURATION);
  }, []);

  const handleComplete = useCallback((completed: boolean, text?: string, errors?: number) => {
    if (startTime && text) {
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;
      const stats = calculateTypingStats(text, duration, errors || 0);
      updateStats(stats);
    }
    setIsActive(false);
    setStartTime(null);
    setTimeLeft(TIMER_DURATION);
  }, [startTime, updateStats]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Time Remaining</h3>
        <div className={`text-2xl font-bold ${timeLeft < 10 ? 'text-red-500' : 'text-foreground'}`}>
          {timeLeft}s
        </div>
      </div>
      
      <TypingPrompt />
      
      <TypingInput
        isActive={isActive}
        onStart={handleStart}
        onComplete={handleComplete}
        timeLeft={timeLeft}
      />
      
      <TypingStats />
    </div>
  );
}