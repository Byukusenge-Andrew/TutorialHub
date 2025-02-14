
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface AdminTypingStats {
  dailyStats: Array<{
    _id: string;
    avgWpm: number;
    totalTests: number;
  }>;
  overallStats: {
    avgWpm: number;
    avgAccuracy: number;
    totalTests: number;
    activeUsers: number;
  };
}

export function AdminTypingStats() {
  const { data: stats, isLoading } = useQuery<AdminTypingStats>({
    queryKey: ['admin-typing-stats'],
    queryFn: async () => {
      const response = await api.typing.getAdminStats();
      return response as AdminTypingStats;
    }
  });

  if (isLoading || !stats) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-lg text-center">
          <h3 className="text-lg font-semibold">Average WPM</h3>
          <p className="text-3xl font-bold text-primary">
            {Math.round(stats.overallStats.avgWpm)}
          </p>
        </div>
        <div className="bg-card p-4 rounded-lg text-center">
          <h3 className="text-lg font-semibold">Average Accuracy</h3>
          <p className="text-3xl font-bold text-primary">
            {Math.round(stats.overallStats.avgAccuracy)}%
          </p>
        </div>
        <div className="bg-card p-4 rounded-lg text-center">
          <h3 className="text-lg font-semibold">Total Tests</h3>
          <p className="text-3xl font-bold text-primary">
            {stats.overallStats.totalTests}
          </p>
        </div>
        <div className="bg-card p-4 rounded-lg text-center">
          <h3 className="text-lg font-semibold">Active Users</h3>
          <p className="text-3xl font-bold text-primary">
            {stats.overallStats.activeUsers}
          </p>
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Daily Activity</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.dailyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="avgWpm"
                stroke="#3b82f6"
                name="Average WPM"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="totalTests"
                stroke="#10b981"
                name="Total Tests"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
} 