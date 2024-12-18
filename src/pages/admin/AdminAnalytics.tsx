import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '@/services/api';

interface AnalyticsData {
  userGrowth: any[];
  tutorialCompletions: any[];
  popularTutorials: any[];
  userActivity: any[];
}

export function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsData>({
    userGrowth: [],
    tutorialCompletions: [],
    popularTutorials: [],
    userActivity: []
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const response = await api.admin.getAnalytics();
      setData(response);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Platform Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
          <h2 className="text-xl font-semibold mb-4">User Growth</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.userGrowth}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#2563eb" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tutorial Completions */}
        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
          <h2 className="text-xl font-semibold mb-4">Tutorial Completions</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.tutorialCompletions}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completions" fill="#16a34a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Tutorials */}
        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
          <h2 className="text-xl font-semibold mb-4">Popular Tutorials</h2>
          <div className="space-y-4">
            {data.popularTutorials.map((tutorial) => (
              <div key={tutorial.id} className="flex items-center justify-between p-4 bg-muted rounded-md">
                <div>
                  <p className="font-medium">{tutorial.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {tutorial.completions} completions
                  </p>
                </div>
                <div className="text-sm font-medium text-primary">
                  {tutorial.rating.toFixed(1)} ★
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Activity */}
        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
          <h2 className="text-xl font-semibold mb-4">User Activity</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.userActivity}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="activeUsers" stroke="#8b5cf6" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
} 