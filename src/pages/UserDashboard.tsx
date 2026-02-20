import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Settings, BookOpen, Code2,
  Keyboard, BookOpenCheck, BrainCircuit, MessageCircle,
  TrendingUp, Activity, ArrowRight
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { useAuth } from '@/providers/AuthProvider';

export function UserDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user?.role === 'admin') {
    navigate('/admin');
  }

  const { data: stats, isLoading } = useQuery({
    queryKey: ['user-stats'],
    queryFn: async () => {
      const [tutorials, typing, dsa] = await Promise.all([
        api.tutorials.getUserProgress(),
        api.typing.getHistory(),
        api.dsa.getUserStats(),
      ]);

      const bestScore = (typing?.history || []).reduce(
        (max: number, test: { wpm: number }) => (test.wpm > max ? test.wpm : max),
        0
      );

      const recentActivity = [
        ...(typing?.history || []).slice(0, 5).map((test: { wpm: number; date: string }) => ({
          type: 'typing',
          title: `Typing Test — ${test.wpm} WPM`,
          date: test.date,
        })),
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      return { tutorials, typing: { ...typing, bestScore }, dsa, recentActivity };
    },
  });

  const QUICK_LINKS = [
    { to: '/community', icon: MessageCircle, label: 'Community', desc: 'Connect with learners', color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400' },
    { to: '/typing', icon: Keyboard, label: 'Typing', desc: 'Improve your speed', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
    { to: '/tutorials', icon: BookOpenCheck, label: 'Tutorials', desc: 'Continue learning', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' },
    { to: '/dsa', icon: BrainCircuit, label: 'DSA', desc: 'Solve challenges', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  ];

  const STAT_CARDS = [
    {
      icon: BookOpen,
      iconClass: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-500/10',
      label: 'Tutorials Completed',
      value: stats?.tutorials?.completed ?? 0,
      sub: `${stats?.tutorials?.inProgress ?? 0} in progress`,
    },
    {
      icon: TrendingUp,
      iconClass: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-500/10',
      label: 'Best Typing Score',
      value: `${Math.round(stats?.typing?.bestScore ?? 0)} WPM`,
      sub: `${stats?.typing?.history?.length ?? 0} tests taken`,
    },
    {
      icon: Code2,
      iconClass: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-500/10',
      label: 'DSA Solved',
      value: stats?.dsa?.solved ?? 0,
      sub: `${Math.round(stats?.dsa?.successRate ?? 0)}% success rate`,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="text-3xl font-bold mb-1">
          Welcome back, <span className="text-primary">{user?.name}</span>!
        </h1>
        <p className="text-muted-foreground">Here's what's happening with your learning journey.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Profile Card */}
        <div className="bg-card border border-border rounded-2xl p-6 flex flex-col items-center text-center gap-4 lg:row-span-2">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center ring-4 ring-primary/20">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <span className="text-3xl font-bold text-primary">{user?.name?.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div>
            <h2 className="text-lg font-bold">{user?.name}</h2>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <span className="inline-block mt-2 px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full capitalize">
              {user?.role}
            </span>
          </div>
          <Link to="/profile" className="w-full">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-accent transition-colors">
              <Settings className="w-4 h-4" />
              View Profile
            </button>
          </Link>
        </div>

        {/* Stat Cards */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {isLoading
            ? [...Array(3)].map((_, i) => (
              <div key={i} className="h-28 bg-muted animate-pulse rounded-2xl" />
            ))
            : STAT_CARDS.map(({ icon: Icon, iconClass, bg, label, value, sub }) => (
              <div key={label} className="bg-card border border-border rounded-2xl p-5">
                <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${iconClass}`} />
                </div>
                <p className="text-xs text-muted-foreground mb-1">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-xs text-muted-foreground mt-1">{sub}</p>
              </div>
            ))}
        </div>

        {/* Quick Links */}
        <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {QUICK_LINKS.map(({ to, icon: Icon, label, desc, color }) => (
            <Link
              key={to}
              to={to}
              className="group bg-card border border-border rounded-2xl p-5 hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className={`w-10 h-10 ${color.split(' ')[0]} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-5 h-5 ${color.split(' ').slice(1).join(' ')}`} />
              </div>
              <p className="font-semibold text-sm">{label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Recent Activity
          </h2>
        </div>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-14 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        ) : !stats?.recentActivity?.length ? (
          <div className="text-center py-10 text-muted-foreground">
            <Activity className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No recent activity yet.</p>
            <Link to="/typing" className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline">
              Start a typing test <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {stats.recentActivity.map((item: { type: string; title: string; date: string }, i: number) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/60 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  {item.type === 'typing' && <Keyboard className="w-4 h-4 text-primary" />}
                  {item.type === 'tutorial' && <BookOpen className="w-4 h-4 text-purple-500" />}
                  {item.type === 'dsa' && <Code2 className="w-4 h-4 text-emerald-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full capitalize">
                  {item.type}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
