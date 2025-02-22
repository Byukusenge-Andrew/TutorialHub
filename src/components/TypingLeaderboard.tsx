import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Trophy } from 'lucide-react';

interface LeaderboardEntry {
  username: string;
  name: string;
  bestWpm: number;
  avgWpm: number;
  avgAccuracy: number;
  totalTests: number;
  score: number;
}

export function TypingLeaderboard() {
  const {
    data: leaderboard = [],
    isLoading,
    error,
  } = useQuery<LeaderboardEntry[], Error>({
    queryKey: ['leaderboard'],
    queryFn: () => api.typing.getLeaderboard(),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  if (!leaderboard.length) return <div>No data available</div>;

  const sortedLeaderboard = [...leaderboard].sort((a, b) => b.score - a.score);

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Trophy className="w-6 h-6 text-yellow-500" />
        Leaderboard
      </h2>
      <div className="space-y-4">
        {sortedLeaderboard.map((entry, index) => (
          <div
            key={entry.name}
            className="flex items-center justify-between p-4 rounded-lg bg-background"
          >
            <div className="flex flex-col gap-1">
              {/* Name at the top */}
              <p className="font-semibold text-lg">{entry.username}</p>
              {/* Other details below the name */}
              <p className="text-sm text-muted-foreground">
                Best Speed: <span className="font-semibold">{Math.round(entry.bestWpm)} WPM</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Avg Accuracy: <span className="font-semibold">{Math.round(entry.avgAccuracy)}%</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Total Tests: <span className="font-semibold">{entry.totalTests}</span>
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* Highlighted Score */}
              <div className="bg-primary/10 p-3 rounded-lg">
                <p className="text-2xl font-bold text-primary">{entry.score}</p>
                <p className="text-sm text-muted-foreground text-center">Score</p>
              </div>
              {/* Rank */}
              <span className="text-2xl font-bold text-primary">#{index + 1}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}