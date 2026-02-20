import React, { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '@/services/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TutorialCard } from '@/components/TutorialCard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Search, Plus, BookOpen, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { Tutorial } from '@/types';

interface TutorialsResponse {
  tutorials: Tutorial[];
  total: number;
  page: number;
  totalPages: number;
}

function TutorialSkeleton() {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 space-y-3 animate-pulse">
      <div className="h-4 w-2/3 bg-muted rounded" />
      <div className="h-3 w-1/3 bg-muted rounded-full" />
      <div className="space-y-2">
        <div className="h-3 w-full bg-muted rounded" />
        <div className="h-3 w-5/6 bg-muted rounded" />
      </div>
    </div>
  );
}

export function TutorialList() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const LIMIT = 12;

  const { data, isLoading, error } = useQuery<TutorialsResponse>({
    queryKey: ['tutorials', page, category, difficulty, search],
    queryFn: async () => {
      const params: Record<string, string | number> = { page, limit: LIMIT };
      if (category && category !== 'all') params.category = category;
      if (difficulty && difficulty !== 'all') params.difficulty = difficulty;
      if (search) params.search = search;
      const res = await api.tutorials.getAll(params);
      return res.data as TutorialsResponse;
    },
    placeholderData: keepPreviousData,
  });

  const tutorials = data?.tutorials || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.total || 0;

  const clearFilters = () => {
    setSearch(''); setCategory(null); setDifficulty(null); setPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold mb-1">Tutorials</h1>
          <p className="text-muted-foreground text-sm">
            {total} tutorials to level up your skills
          </p>
        </div>
        {user?.role === 'admin' && (
          <Link to="/tutorials/create">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> New Tutorial
            </Button>
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search tutorials…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-10"
          />
        </div>
        <Select value={difficulty || 'all'} onValueChange={(v) => { setDifficulty(v === 'all' ? null : v); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Difficulties</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
        <Select value={category || 'all'} onValueChange={(v) => { setCategory(v === 'all' ? null : v); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="react">React</SelectItem>
            <SelectItem value="css">CSS</SelectItem>
            <SelectItem value="algorithms">Algorithms</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Error */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>Failed to load tutorials. Please try again.</AlertDescription>
        </Alert>
      )}

      {/* Results count */}
      {!isLoading && (
        <p className="text-sm text-muted-foreground">
          Showing {tutorials.length} of {total} tutorials
          {(search || category || difficulty) && (
            <button onClick={clearFilters} className="ml-2 text-primary hover:underline">Clear filters</button>
          )}
        </p>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[...Array(LIMIT)].map((_, i) => <TutorialSkeleton key={i} />)}
        </div>
      ) : tutorials.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-30" />
          <h3 className="text-lg font-semibold mb-1">No tutorials found</h3>
          <p className="text-muted-foreground text-sm mb-4">Try a different search or filter.</p>
          <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {tutorials.map((tutorial) => (
            <TutorialCard key={tutorial._id} tutorial={tutorial} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" /> Prev
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex items-center gap-1"
          >
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}