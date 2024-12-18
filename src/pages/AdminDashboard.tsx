import React, { useState, useEffect } from 'react';
import { Users, BookOpen, BarChart2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/auth-store';
import { api } from '@/services/api';


interface Stats {
  totalTutorials: number;
  totalUsers: number;
  totalCompletions: number;
  activeUsers: number;
  completionRate: number;
}

export function AdminDashboard() {

  const [stats, setStats] = useState<Stats>({
    totalTutorials: 0,
    totalUsers: 0,
    totalCompletions: 0,
    activeUsers: 0,
    completionRate: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await api.admin.getStats();
      setStats(response);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };
  const {  user } = useAuthStore();
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
        <div className="text-foreground font-bold text-xlg flex items-center gap-2">
          {user?.name}
            </div>
        </h1>
        <div className="space-x-4">
          <Link
            to="/tutorials/create"
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Tutorial
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <h3 className="text-2xl font-bold">{stats.totalUsers}</h3>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
          <div className="flex items-center space-x-3">
            <BookOpen className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Total Tutorials</p>
              <h3 className="text-2xl font-bold">{stats.totalTutorials}</h3>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-purple-500" />
            <div>
              <p className="text-sm text-muted-foreground">Active Users</p>
              <h3 className="text-2xl font-bold">{stats.activeUsers}</h3>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
          <div className="flex items-center space-x-3">
            <BarChart2 className="h-8 w-8 text-yellow-500" />
            <div>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
              <h3 className="text-2xl font-bold">{stats.completionRate}%</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
          <h2 className="text-xl font-semibold mb-4">Recent Users</h2>
          <div className="space-y-4">
            {/* Recent Users */}
          </div>
        </div>

        {/* Recent Tutorials */}
        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
          <h2 className="text-xl font-semibold mb-4">Recent Tutorials</h2>
          <div className="space-y-4">
            {/* Recent Tutorials */}
          </div>
        </div>
      </div>

      {/* Management Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/users"
          className="p-6 bg-card rounded-lg shadow-sm border border-border hover:border-primary transition-colors"
        >
          <Users className="h-8 w-8 mb-4 text-primary" />
          <h3 className="text-lg font-semibold mb-2">User Management</h3>
          <p className="text-sm text-muted-foreground">
            Manage users, roles, and permissions
          </p>
        </Link>

        <Link
          to="/admin/tutorials"
          className="p-6 bg-card rounded-lg shadow-sm border border-border hover:border-primary transition-colors"
        >
          <BookOpen className="h-8 w-8 mb-4 text-primary" />
          <h3 className="text-lg font-semibold mb-2">Tutorial Management</h3>
          <p className="text-sm text-muted-foreground">
            Create and manage tutorials
          </p>
        </Link>

        <Link
          to="/admin/analytics"
          className="p-6 bg-card rounded-lg shadow-sm border border-border hover:border-primary transition-colors"
        >
          <BarChart2 className="h-8 w-8 mb-4 text-primary" />
          <h3 className="text-lg font-semibold mb-2">Analytics</h3>
          <p className="text-sm text-muted-foreground">
            View detailed platform analytics
          </p>
        </Link>
      </div>
    </div>
  );
}