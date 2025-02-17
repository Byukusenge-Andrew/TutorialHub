
import { StatCard } from '@/components/ui/stat-card';


interface TypingHistoryProps {
  data?: {
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

export function TypingHistory({ data }: TypingHistoryProps) {
  if (!data) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!data.history || !data.stats) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No typing history available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          title="Best Score"
          value={data.stats.bestScore}
        />
        <StatCard
          title="Total Tests"
          value={data.stats.totalTests}
        />
        <StatCard
          title="Avg. Accuracy"
          value={`${Math.round(data.stats.avgAccuracy)}%`}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Recent Tests</h3>
        {data.history.map((record, index) => (
          <div key={index} className="bg-card p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Score: {record.score}</p>
                <p className="text-sm text-muted-foreground">
                  {record.wpm} WPM • {record.accuracy}% Accuracy
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                {new Date(record.date).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 