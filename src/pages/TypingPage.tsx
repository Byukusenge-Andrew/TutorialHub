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

  const { data: stats } = useQuery<TypingHistory>({
    queryKey: ['typing-stats'],
    queryFn: async () => {
      const historyResponse = await api.typing.getHistory();
      const history = historyResponse.data;
      const avgWpm = history.reduce((acc, curr) => acc + curr.wpm, 0) / history.length;
      const avgAccuracy = history.reduce((acc, curr) => acc + curr.accuracy, 0) / history.length;

      return {
        recentTests: history,
        averages: {
          avgWpm,
          avgAccuracy,
          totalTests: history.length
        }
      };
    }
  });

  const saveMutation = useMutation({
    mutationFn: (stats: TypingStats) => api.typing.saveResult({
      wpm: stats.wpm,
      accuracy: stats.accuracy,
      time: stats.duration,
      totalWords: Math.round(stats.characters / 5),
      errors: stats.errors
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['typing-stats'] });
    }
  });

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

    // Check current character
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
        setCurrentStats(stats);
        saveMutation.mutate(stats);
      }
      setIsFinished(true);
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-card rounded-lg border border-border p-6">
            <TypingPrompt 
              text={text}
              input={input}
              currentCharIndex={currentCharIndex}
              incorrectChars={incorrectChars}
              onInput={handleInputChange}
              isFinished={isFinished}
              onReset={resetTest}
            />
           

            {currentStats && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card p-4 rounded-lg text-center">
                  <h3 className="text-lg font-semibold">WPM</h3>
                  <p className="text-3xl font-bold text-primary">{currentStats.wpm}</p>
                </div>
                <div className="bg-card p-4 rounded-lg text-center">
                  <h3 className="text-lg font-semibold">Accuracy</h3>
                  <p className="text-3xl font-bold text-primary">{currentStats.accuracy}%</p>
                </div>
                <div className="bg-card p-4 rounded-lg text-center">
                  <h3 className="text-lg font-semibold">Time</h3>
                  <p className="text-3xl font-bold text-primary">
                    {Math.round(currentStats.duration)}s
                  </p>
                </div>
              </div>
            )}

            {stats && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Your Progress</h2>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.recentTests}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="wpm" stroke="#3b82f6" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-card p-4 rounded-lg text-center">
                    <h3 className="text-lg font-semibold">Average WPM</h3>
                    <p className="text-3xl font-bold text-primary">
                      {Math.round(stats.averages.avgWpm)}
                    </p>
                  </div>
                  <div className="bg-card p-4 rounded-lg text-center">
                    <h3 className="text-lg font-semibold">Average Accuracy</h3>
                    <p className="text-3xl font-bold text-primary">
                      {Math.round(stats.averages.avgAccuracy)}%
                    </p>
                  </div>
                  <div className="bg-card p-4 rounded-lg text-center">
                    <h3 className="text-lg font-semibold">Total Tests</h3>
                    <p className="text-3xl font-bold text-primary">
                      {stats.averages.totalTests}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-center gap-4 my-2">
              <Button onClick={resetTest} size="lg" 
                variant={isFinished ? 'outline' : 'default'}
                className={isFinished ? 'bg-red-500' : ''}
              >
                {isFinished ? 'Try Again' : 'Reset'}
              </Button>
              <Button 
                onClick={handleNewPrompt} 
                size="lg"
              >
                New Text
              </Button>
            </div>
          </div>
        </div>
        
        <div className='flex flex-col gap-4'>
          {activeTab === 'history' && <TypingHistory />}
          {activeTab === 'leaderboard' && <TypingLeaderboard />}
        </div>
      </div>
    </div>
  );
}
