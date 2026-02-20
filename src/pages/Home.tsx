import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Keyboard, Users, Code2, ArrowRight, Star, Zap, Shield } from 'lucide-react';
import { api } from '@/services/api';
import { useEffect, useState } from 'react';
import { Tutorial } from '../types';
import { useAuth } from '@/providers/AuthProvider';

const FEATURE_CARDS = [
  {
    to: '/typing',
    icon: Keyboard,
    color: 'from-blue-500 to-cyan-400',
    bg: 'bg-blue-500/10',
    iconColor: 'text-blue-600 dark:text-blue-400',
    title: 'Practice Typing',
    description: 'Improve your typing speed and accuracy with interactive exercises and real-time stats.',
  },
  {
    to: '/tutorials',
    icon: BookOpen,
    color: 'from-purple-500 to-violet-400',
    bg: 'bg-purple-500/10',
    iconColor: 'text-purple-600 dark:text-purple-400',
    title: 'Written Guides',
    description: 'Detailed step-by-step tutorials covering every skill level from beginner to advanced.',
  },
  {
    to: '/dsa',
    icon: Code2,
    color: 'from-emerald-500 to-teal-400',
    bg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    title: 'DSA Challenges',
    description: 'Test your problem-solving skills with curated data structures and algorithm exercises.',
  },
  {
    to: '/community',
    icon: Users,
    color: 'from-orange-500 to-amber-400',
    bg: 'bg-orange-500/10',
    iconColor: 'text-orange-600 dark:text-orange-400',
    title: 'Community',
    description: 'Join thousands of learners — ask questions, share insights, and grow together.',
  },
];

const STATS = [
  { value: '10k+', label: 'Learners', icon: Users },
  { value: '200+', label: 'Tutorials', icon: BookOpen },
  { value: '50+', label: 'DSA Problems', icon: Code2 },
  { value: '4.9★', label: 'Avg. Rating', icon: Star },
];

export function Home() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.tutorials.getAll();
        setTutorials(res?.data?.tutorials || []);
      } catch {
        setTutorials([]);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-24 pb-16">
      {/* ——— Hero ——— */}
      <section className="relative overflow-hidden">
        {/* Background gradient blob */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 pointer-events-none
            bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,hsl(var(--primary)/0.15),transparent)]"
        />
        <div className="container mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-primary/20">
            <Zap className="h-3 w-3" />
            Your all-in-one learning platform
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            Learn. Practice. <br className="hidden sm:block" />
            <span className="text-primary">Level Up.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
            TutorialHub brings together structured tutorials, coding challenges, typing practice, and a vibrant community — all in one place.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                >
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/tutorials"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-xl font-semibold hover:bg-accent/80 transition-colors border border-border"
                >
                  Browse Tutorials
                </Link>
              </>
            ) : (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              >
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>

        {/* Stats strip */}
        <div className="container mx-auto px-4 mt-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map(({ value, label, icon: Icon }) => (
              <div key={label} className="bg-card border border-border rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-1">{value}</div>
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— Features ——— */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Everything you need to grow</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Four powerful modules, one seamless experience.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURE_CARDS.map(({ to, icon: Icon, bg, iconColor, title, description }) => (
            <Link
              key={to}
              to={to}
              className="group relative bg-card border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300`}>
                <Icon className={`h-6 w-6 ${iconColor}`} />
              </div>
              <h3 className="font-semibold text-lg mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              <div className="mt-4 flex items-center gap-1 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Explore <ArrowRight className="h-3.5 w-3.5 mt-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ——— Latest Tutorials ——— */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-1">Latest Tutorials</h2>
            <p className="text-muted-foreground text-sm">Fresh content added regularly</p>
          </div>
          <Link
            to="/tutorials"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-44 rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : tutorials.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p>No tutorials available yet.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutorials.slice(0, 3).map((t) => (
              <Link
                key={t._id}
                to={`/tutorials/${t._id}`}
                className="group bg-card border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="px-2.5 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                    {t.category || 'Tutorial'}
                  </span>
                  <Star className="h-4 w-4 text-amber-400 fill-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="font-semibold text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {t.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {t.description || 'No description available.'}
                </p>
                <div className="mt-4 flex items-center gap-1 text-primary text-sm font-medium">
                  Start Learning <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-6 text-center sm:hidden">
          <Link to="/tutorials" className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1">
            View all tutorials <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ——— CTA Banner ——— */}
      {!isAuthenticated && (
        <section className="container mx-auto px-4">
          <div className="relative overflow-hidden bg-primary rounded-2xl p-10 text-center text-primary-foreground">
            <div aria-hidden className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,white,transparent)]" />
            <Shield className="h-10 w-10 mx-auto mb-4 opacity-80" />
            <h2 className="text-2xl font-bold mb-2">Ready to get started?</h2>
            <p className="opacity-80 mb-6 max-w-sm mx-auto text-sm">
              Create a free account and unlock all tutorials, challenges, and community features.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary rounded-xl font-semibold hover:bg-white/90 transition-colors"
            >
              Join for free <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
