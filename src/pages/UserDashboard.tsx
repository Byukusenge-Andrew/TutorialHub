import { useAuthStore } from '@/store/auth-store';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  User, Settings, BookOpen, Timer, Code2, 
  Keyboard, BookOpenCheck, BrainCircuit, MessageCircle 
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';

export function UserDashboard() {
  const { user } = useAuthStore();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['user-stats'],
    queryFn: async () => {
      const [tutorials, typing, dsa] = await Promise.all([
        api.tutorials.getUserProgress(),
        api.typing.getHistory(),
        api.dsa.getUserStats()
      ]);

      

      // Get the best score from typing history
      const bestScore = typing.history.reduce((max, test) => 
        test.wpm > max ? test.wpm : max, 0);

      return { 
        tutorials, 
        typing: {
          ...typing,
          bestScore
        }, 
        dsa,
        recentActivity: [
          ...typing.history.slice(0, 3).map(test => ({
            type: 'typing',
            title: `Typing Test: ${test.wpm} WPM`,
            date: test.date
          })),
          // Add other activities here
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      };
    }
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8">Welcome back, {user?.name}!</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {/* Profile Card */}
        <Card className="p-6 lg:row-span-2">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-primary" />
              )}
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold">{user?.name}</h2>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
            <Link to="/profile" className="w-full">
              <Button variant="outline" className="w-full">
                <Settings className="w-4 h-4 mr-2" />
                View Profile
              </Button>
            </Link>
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard
            icon={<BookOpen className="text-blue-600" />}
            label="Tutorials Completed"
            value={stats?.tutorials.completed || 0}
            subValue={`${stats?.tutorials.inProgress || 0} in progress`}
          />
          <StatsCard
            icon={<Timer className="text-green-600" />}
            label="Best Score"
            value={`${Math.round(stats?.typing.bestScore || 0)} WPM`}
            subValue={`Last 7 days: ${stats?.typing.history.length || 0} tests`}
          />
          <StatsCard
            icon={<Code2 className="text-purple-600" />}
            label="DSA Solved"
            value={stats?.dsa.solved || 0}
            subValue={`${Math.round(stats?.dsa.successRate || 0)}% success rate`}
          />
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <QuickAccessCard
          to="/community"
          icon={<MessageCircle />}
          title="Community"
          description="Connect with other learners"
        />
        <QuickAccessCard
          to="/typing"
          icon={<Keyboard />}
          title="Practice Typing"
          description="Improve your speed"
        />
        <QuickAccessCard
          to="/tutorials"
          icon={<BookOpenCheck />}
          title="Tutorials"
          description="Continue learning"
        />
        <QuickAccessCard
          to="/dsa"
          icon={<BrainCircuit />}
          title="DSA Challenges"
          description="Test your skills"
        />
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {stats?.recentActivity.map((activity, index) => (
            <ActivityItem
              key={index}
              type={activity.type}
              title={activity.title}
              date={activity.date}
            />
          ))}
          {(!stats?.recentActivity || stats.recentActivity.length === 0) && (
            <p className="text-muted-foreground text-center py-4">
              No recent activity
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}

// Helper Components
function StatsCard({ icon, label, value, subValue }: any) {
  return (
    <Card className="p-6">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-primary/10 rounded-lg">
          {icon}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
          <p className="text-sm text-muted-foreground">{subValue}</p>
        </div>
      </div>
    </Card>
  );
}

function QuickAccessCard({ to, icon, title, description }: any) {
  return (
    <Link to={to}>
      <Card className="p-6 hover:shadow-lg transition-shadow h-full">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-3 bg-primary/10 rounded-full">
            {icon}
          </div>
          <div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}

function ActivityItem({ type, title, date }: any) {
  const getIcon = () => {
    switch (type) {
      case 'tutorial':
        return <BookOpen className="w-5 h-5 text-blue-500" />;
      case 'typing':
        return <Keyboard className="w-5 h-5 text-green-500" />;
      case 'dsa':
        return <Code2 className="w-5 h-5 text-purple-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
      <div className="flex items-center gap-4">
        {getIcon()}
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">
            {new Date(date).toLocaleDateString()}
          </p>
        </div>
      </div>
      <span className="text-sm text-muted-foreground capitalize">{type}</span>
    </div>
  );
}