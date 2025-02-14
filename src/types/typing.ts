export interface TypingStats {
  wpm: number;
  accuracy: number;
  duration: number;
  score: number;
  date?: Date;
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
    records: TypingStats[];
    stats: TypingHistoryStats;
  };
} 