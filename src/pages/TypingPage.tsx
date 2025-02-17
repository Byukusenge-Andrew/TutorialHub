import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TypingLeaderboard } from '@/components/TypingLeaderboard';
import { TypingPrompt } from '@/components/TypingPrompt';
import { useTypingPrompt } from '@/hooks/use-typing-prompt';
import { TypingHistory } from '@/components/TypingHistory';

interface TypingStats {
  wpm: number;
  accuracy: number;
  duration: number;
  characters: number;
  errors: number;
}

interface TypingHistory {
  recentTests: {
    wpm: number;
    accuracy: number;
    date: string;
  }[];
  averages: {
    avgWpm: number;
    avgAccuracy: number;
    totalTests: number;
  };
}


export function TypingPage() {
  const { currentPrompt: text, setNewPrompt } = useTypingPrompt();
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [currentStats, setCurrentStats] = useState<TypingStats | null>(null);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState('history');
  const queryClient = useQueryClient();

  const saveRecordMutation = useMutation({
    mutationFn: (stats: TypingStats) => api.typing.saveRecord(stats),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['typing-history'] });
    }
  });

  const saveStatMutation = useMutation({
    mutationFn: (stats: TypingStats) => api.typing.savestatResult(stats),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['typing-stats'] });
    }
  });

  const { data: history } = useQuery({
    queryKey: ['typing-history'],
    queryFn: () => api.typing.getHistory(),
    staleTime: 30000,
  });
  useEffect(() => {
    if (history) {
      console.log('Typing History Data:', history); // Log the history data
    }
  }, [history]); 

  const calculateStats = useCallback(() => {
    if (!startTime) return null;

    const duration = (Date.now() - startTime) / 1000;
    const characters = input.length;
    const words = characters / 5; // Standard WPM calculation
    const wpm = Math.round((words / duration) * 60);
    
    const correctChars = [...input].reduce((count, char, i) => 
      count + (char === text[i] ? 1 : 0), 0);
    
    const accuracy = Math.round((correctChars / text.length) * 100);

    return {
      wpm,
      accuracy,
      duration,
      characters: text.length,
      errors: characters - correctChars
    };
  }, [text, input, startTime]);

  const handleTestComplete = (stats: TypingStats) => {
    setCurrentStats(stats);
    setIsFinished(true);
    saveRecordMutation.mutate(stats);
    saveStatMutation.mutate(stats);
  };

  const resetTest = () => {
    setInput('');
    setStartTime(null);
    setIsFinished(false);
    setCurrentStats(null);
    setCurrentCharIndex(0);
    setIncorrectChars(new Set());
  };

  const handleNewPrompt = () => {
    resetTest();
    setNewPrompt();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFinished) return;

    if (!startTime) {
      setStartTime(Date.now());
    }

    const newInput = e.target.value;
    setInput(newInput);

    if (newInput.length > 0) {
      const currentChar = newInput[newInput.length - 1];
      const expectedChar = text[newInput.length - 1];

      if (currentChar !== expectedChar) {
        setIncorrectChars(prev => new Set([...prev, newInput.length - 1]));
      }
    }

    setCurrentCharIndex(newInput.length);

 
    if (newInput.length === text.length) {
      const stats = calculateStats();
      if (stats) {
        handleTestComplete(stats);
      }
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleProgress = (stats: TypingStats) => {
    setCurrentStats(stats);
  };

  useEffect(() => {
    
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-center mb-4">
        <Button 
          className={`px-4 py-2 ${activeTab === 'history' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} 
          onClick={() => handleTabChange('history')}
        >
          Typing History
        </Button>
        <Button 
          className={`px-4 py-2 ${activeTab === 'leaderboard' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} 
          onClick={() => handleTabChange('leaderboard')}
        >
          Leaderboard
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <TypingPrompt 
            text={text}
            input={input}
            currentCharIndex={currentCharIndex}
            incorrectChars={incorrectChars}
            onInput={handleInputChange}
            isFinished={isFinished}
            onComplete={handleTestComplete}
            onProgress={handleProgress}
            onReset={resetTest} 
          />

          {currentStats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-card p-4 rounded-lg text-center">
                <h3 className="text-lg font-semibold">WPM</h3>
                <p className="text-3xl font-bold text-primary">
                  {currentStats.wpm}
                </p>
              </div>
              <div className="bg-card p-4 rounded-lg text-center">
                <h3 className="text-lg font-semibold">Accuracy</h3>
                <p className="text-3xl font-bold text-primary">
                  {currentStats.accuracy}%
                </p>
              </div>
              <div className="bg-card p-4 rounded-lg text-center">
                <h3 className="text-lg font-semibold">Score</h3>
                <p className="text-3xl font-bold text-primary">
                  {Math.round(currentStats.wpm * (currentStats.accuracy / 100))}
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-center gap-4 my-4">
            <Button 
              onClick={resetTest} 
              size="lg"
              variant={isFinished ? 'outline' : 'default'}
              className={isFinished ? 'bg-red-500' : ''}
            >
              {isFinished ? 'Try Again' : 'Reset'}
            </Button>
            <Button onClick={handleNewPrompt} size="lg">
              New Text
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {activeTab === 'history' && <TypingHistory data={history} />}
          {activeTab === 'leaderboard' && <TypingLeaderboard />}
        </div>
      </div>
    </div>
  );
}
