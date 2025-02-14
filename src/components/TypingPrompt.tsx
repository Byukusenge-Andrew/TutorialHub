import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { TypingStats } from '@/types/typing';

interface TypingPromptProps {
  text: string;
  input: string;
  currentCharIndex: number;
  incorrectChars: Set<number>;
  onInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isFinished: boolean;
  onReset: () => void;
}

export function TypingPrompt({ 
  text, 
  input, 
  currentCharIndex, 
  incorrectChars,
  onInput,
  isFinished,
  onReset 
}: TypingPromptProps) {
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const queryClient = useQueryClient();
  
  const saveMutation = useMutation({
    mutationFn: (stats: TypingStats) => api.typing.saveResult(stats),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['typing-history'] });
    }
  });

  // Start timer on first input
  useEffect(() => {
    if (input.length === 1 && !timerActive) {
      setTimerActive(true);
    }
  }, [input.length]);

  // Handle timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && !isFinished) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, isFinished]);

  // Reset timer when test is reset
  useEffect(() => {
    if (!input) {
      setTimer(0);
      setTimerActive(false);
    }
  }, [input]);

  const calculateScore = () => {
    const wpm = Math.round((input.length / 5) / (timer / 60));
    const accuracy = Math.round((text.length - incorrectChars.size) / text.length * 100);
    const score = Math.round((wpm * accuracy) / 100); // Weight both speed and accuracy
    return { wpm, accuracy, score };
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTestComplete = (stats: TypingStats) => {
    saveMutation.mutate(stats);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <span className="text-2xl font-mono">{formatTime(timer)}</span>
        {isFinished && (
          <div className="space-y-2">
            <div className="text-lg">Speed: {calculateScore().wpm} WPM</div>
            <div className="text-lg">Accuracy: {calculateScore().accuracy}%</div>
            <div className="text-lg font-bold">Score: {calculateScore().score}</div>
          </div>
        )}
      </div>
      <div className="font-mono text-lg leading-relaxed">
        {text.split('').map((char, index) => (
          <span
            key={index}
            className={cn(
              "transition-colors",
              index === currentCharIndex && "bg-primary/20",
              index < currentCharIndex && (
                incorrectChars.has(index)
                  ? "text-red-500"
                  : "text-green-500"
              ),
              index < currentCharIndex && "opacity-50"
            )}
          >
            {char}
          </span>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={onInput}
        disabled={isFinished}
        className="w-full p-8 my-4 font-mono bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="Start typing..."
        autoFocus
      />
    </div>
  );
}