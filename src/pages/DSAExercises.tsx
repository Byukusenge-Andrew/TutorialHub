import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '@/services/api';
import { DSAExercise } from '@/types/dsa';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Search, Plus, Code2, CheckCircle2,
  TrendingUp, Zap, Filter
} from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';

type DSAExerciseWithId = DSAExercise & { _id: string };

const DIFFICULTY_MAP: Record<string, { label: string; color: string; dot: string }> = {
  easy: { label: 'Easy', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20', dot: 'bg-emerald-500' },
  medium: { label: 'Medium', color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20', dot: 'bg-amber-500' },
  hard: { label: 'Hard', color: 'text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/20', dot: 'bg-red-500' },
};

function ExerciseSkeleton() {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-4 animate-pulse">
      <div className="flex justify-between">
        <div className="h-5 w-2/3 bg-muted rounded" />
        <div className="h-5 w-16 bg-muted rounded-full" />
      </div>
      <div className="h-3 w-1/3 bg-muted rounded" />
      <div className="space-y-2">
        <div className="h-3 w-full bg-muted rounded" />
        <div className="h-3 w-5/6 bg-muted rounded" />
      </div>
      <div className="flex justify-between pt-2">
        <div className="h-4 w-20 bg-muted rounded" />
        <div className="h-4 w-24 bg-muted rounded" />
      </div>
    </div>
  );
}

export function DSAExercises() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery<DSAExerciseWithId[], Error>({
    queryKey: ['dsa-exercises', difficulty, category],
    queryFn: async () => {
      const result = await api.dsa.getExercises(difficulty ?? undefined, category ?? undefined);
      return result as DSAExerciseWithId[];
    },
    retry: 2,
  });

  const exercises: DSAExerciseWithId[] = Array.isArray(data) ? data : [];

  const filtered = exercises.filter((e) => {
    if (difficulty && difficulty !== 'all' && e.difficulty !== difficulty) return false;
    if (category && category !== 'all' && e.category !== category) return false;
    if (search) {
      const q = search.toLowerCase();
      return e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q);
    }
    return true;
  });

  const categories = [...new Set(exercises.map((e) => e.category))];
  const totalEasy = exercises.filter((e) => e.difficulty === 'easy').length;
  const totalMedium = exercises.filter((e) => e.difficulty === 'medium').length;
  const totalHard = exercises.filter((e) => e.difficulty === 'hard').length;

  const clearFilters = () => { setSearch(''); setDifficulty(null); setCategory(null); };

  if (error) {
    return (
      <Alert variant="destructive" className="mx-auto max-w-2xl mt-8">
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-background border border-border rounded-2xl p-8">
        <div aria-hidden className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-primary text-sm font-semibold mb-2">
              <Zap className="h-4 w-4" /> Practice Mode
            </div>
            <h1 className="text-4xl font-extrabold mb-2">DSA Exercises</h1>
            <p className="text-muted-foreground max-w-md">
              Sharpen your problem-solving skills with hand-crafted data structures &amp; algorithms challenges.
            </p>
            <div className="flex flex-wrap gap-4 mt-5">
              {[
                { count: totalEasy, label: 'Easy', dot: 'bg-emerald-500' },
                { count: totalMedium, label: 'Medium', dot: 'bg-amber-500' },
                { count: totalHard, label: 'Hard', dot: 'bg-red-500' },
              ].map(({ count, label, dot }) => (
                <div key={label} className="flex items-center gap-2 text-sm">
                  <span className={`w-2 h-2 rounded-full ${dot} shrink-0`} />
                  <span className="font-semibold">{count}</span>
                  <span className="text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>
          {user?.role === 'admin' && (
            <Link to="/dsa/create">
              <Button className="flex items-center gap-2 shrink-0">
                <Plus className="h-4 w-4" /> Create Exercise
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search exercises…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={difficulty || 'all'} onValueChange={(v) => setDifficulty(v === 'all' ? null : v)}>
          <SelectTrigger>
            <SelectValue placeholder="All Difficulties" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Difficulties</SelectItem>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>
        <Select value={category || 'all'} onValueChange={(v) => setCategory(v === 'all' ? null : v)}>
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      {!isLoading && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filtered.length} exercise{filtered.length !== 1 ? 's' : ''} found
          </p>
          {(search || difficulty || category) && (
            <button onClick={clearFilters} className="text-sm text-primary hover:underline flex items-center gap-1">
              <Filter className="h-3.5 w-3.5" /> Clear filters
            </button>
          )}
        </div>
      )}

      {/* Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <ExerciseSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Code2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-30" />
          <h3 className="text-lg font-semibold mb-2">No exercises found</h3>
          <p className="text-muted-foreground text-sm mb-4">Try adjusting your search or filters.</p>
          <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((exercise) => {
            const diff = DIFFICULTY_MAP[exercise.difficulty] || DIFFICULTY_MAP.easy;
            return (
              <Link key={exercise._id} to={`/dsa/${exercise._id}`}>
                <div className="group bg-card border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-base leading-snug group-hover:text-primary transition-colors flex-1 pr-2">
                      {exercise.title}
                    </h3>
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0 ${diff.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${diff.dot}`} />
                      {diff.label}
                    </span>
                  </div>

                  <span className="text-xs text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full w-fit mb-3">
                    {exercise.category}
                  </span>

                  <p className="text-sm text-muted-foreground line-clamp-2 flex-1 mb-4">
                    {exercise.description}
                  </p>

                  <div className="space-y-2">
                    {/* Success rate bar */}
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Success Rate</span>
                      <span className="font-semibold">{exercise.successRate ?? 0}%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary/60 rounded-full transition-all duration-500"
                        style={{ width: `${exercise.successRate ?? 0}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {exercise.testCases.length} test cases
                      </span>
                      <span className="flex items-center gap-1 text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Solve →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}