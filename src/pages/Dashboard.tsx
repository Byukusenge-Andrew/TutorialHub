
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { useAuthStore } from '@/store/auth-store';
import { BookOpen, Code2, Timer, Users, MessageSquare, MessageCircle, Heart } from 'lucide-react';

interface StudentStats {
  tutorials: {
    completed: number;
    inProgress: number;
    totalTime: number;
  };
  typing: {
    avgWpm: number;
    avgAccuracy: number;
    bestWpm: number;
    totalTests: number;
  };
  dsa: {
    solved: number;
    totalAttempted: number;
    successRate: number;
  };
  community: {
    posts: number;
    comments: number;
    likes: number;
    recentActivity: Array<{
      type: 'post' | 'comment' | 'like';
      title: string;
      date: string;
    }>;
  };
}

export function Dashboard() {
  const { user } = useAuthStore();

  const { data: stats, isLoading } = useQuery<StudentStats, Error>({
    queryKey: ['student-stats'],
    queryFn: () => api.dashboard.getStudentStats() as Promise<StudentStats>,
    refetchInterval: 5000 // Refresh every 5 seconds
  });

  if (isLoading || !stats) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Completed Tutorials",
      value: stats.tutorials.completed,
      total: stats.tutorials.completed + stats.tutorials.inProgress,
      icon: BookOpen,
      color: "text-blue-500"
    },
    {
      title: "Average Typing Speed",
      value: Math.round(stats.typing.avgWpm),
      unit: "WPM",
      icon: Timer,
      color: "text-green-500",
      subtitle: `${Math.round(stats.typing.avgAccuracy)}% accuracy`
    },
    {
      title: "DSA Challenges Solved",
      value: stats.dsa.solved,
      total: stats.dsa.totalAttempted,
      icon: Code2,
      color: "text-purple-500",
      subtitle: `${Math.round(stats.dsa.successRate)}% success rate`
    },
    {
      title: "Community Activity",
      value: stats.community.posts,
      icon: Users,
      color: "text-orange-500",
      subtitle: `${stats.community.comments} comments • ${stats.community.likes} likes`
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome back, {user?.name}!</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-muted-foreground mb-2">
                  {stat.title}
                </h2>
                <p className="text-3xl font-bold">
                  {stat.value}
                  {stat.unit && <span className="text-lg ml-1">{stat.unit}</span>}
                  {stat.total && (
                    <span className="text-lg text-muted-foreground">
                      /{stat.total}
                    </span>
                  )}
                </p>
                {stat.subtitle && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {stat.subtitle}
                  </p>
                )}
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
            {stat.total && (
              <div className="mt-4 bg-background rounded-full h-2">
                <div
                  className={`h-full rounded-full ${stat.color.replace('text', 'bg')}`}
                  style={{
                    width: `${(stat.value / stat.total) * 100}%`
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6">Community Activity</h2>
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="space-y-4">
            {stats.community.recentActivity.map((activity, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-4 bg-background rounded-lg"
              >
                <div className="flex items-center gap-4">
                  {activity.type === 'post' && <MessageSquare className="w-5 h-5 text-blue-500" />}
                  {activity.type === 'comment' && <MessageCircle className="w-5 h-5 text-green-500" />}
                  {activity.type === 'like' && <Heart className="w-5 h-5 text-red-500" />}
                  <div>
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(activity.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground capitalize">
                  {activity.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 