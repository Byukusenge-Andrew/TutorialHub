
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Trophy } from 'lucide-react';

interface LeaderboardEntry {
  name: string;
  bestWpm: number;
  avgWpm: number;
  avgAccuracy: number;
  totalTests: number;
}

export function TypingLeaderboard() {
  const { data: leaderboard, isLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ['typing-leaderboard'],
    queryFn: () => api.typing.getLeaderboard() as Promise<LeaderboardEntry[]>
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Trophy className="w-6 h-6 text-yellow-500" />
        Leaderboard
      </h2>
      <div className="space-y-4">
        {leaderboard?.map((entry, index) => (
          <div
            key={entry.name}
            className="flex items-center justify-between p-4 rounded-lg bg-background"
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-primary">#{index + 1}</span>
              <div>
                <p className="font-semibold">{entry.name}</p>
                <p className="text-sm text-muted-foreground">
                  {Math.round(entry.avgAccuracy)}% accuracy • {entry.totalTests} tests
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{Math.round(entry.bestWpm)} WPM</p>
              <p className="text-sm text-muted-foreground">Best Speed</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 