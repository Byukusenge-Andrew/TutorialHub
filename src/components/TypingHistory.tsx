import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { StatCard } from '@/components/ui/stat-card';
import { TypingHistoryResponse } from '@/types/typing';

export function TypingHistory() {
  const { data: response, isLoading } = useQuery<TypingHistoryResponse>({
    queryKey: ['typing-history'],
    queryFn: () => api.typing.getHistory().then(response => response as unknown as TypingHistoryResponse)
  });

  if (isLoading) return <div>Loading...</div>;

  const data = response?.data;

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          title="High Score" 
          value={data?.stats.highScore ?? 0} 
        />
        <StatCard 
          title="Avg WPM" 
          value={Math.round(data?.stats.avgWpm ?? 0)} 
        />
        <StatCard 
          title="Avg Accuracy" 
          value={`${Math.round(data?.stats.avgAccuracy ?? 0)}%`} 
        />
        <StatCard 
          title="Total Tests" 
          value={data?.stats.totalTests ?? 0} 
        />
      </div>

      {/* Recent Tests */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Recent Tests</h3>
        {data?.records.map((record, index) => (
          <div key={index} className="flex justify-between items-center p-4 bg-card rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">
                {record.date ? new Date(record.date).toLocaleDateString() : 'N/A'}
              </p>
              <p className="font-medium">{record.wpm} WPM</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Score</p>
              <p className="font-medium">{record.score}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Accuracy</p>
              <p className="font-medium">{record.accuracy}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 