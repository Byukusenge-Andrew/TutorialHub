export interface TypingStats {
  wpm: number;
  accuracy: number;
  duration: number;
  characters: number;
  errors: number;
  score?: number;
}

export interface TypingHistoryStats {
  avgWpm: number;
  avgAccuracy: number;
  totalTests: number;
  highScore: number;
}

export interface TypingHistoryResponse {
  status: string;
  data: {
    history: Array<{
      wpm: number;
      accuracy: number;
      score: number;
      date: string;
      duration: number;
    }>;
    stats: {
      bestScore: number;
      totalTests: number;
      avgAccuracy: number;
    };
  };
} 