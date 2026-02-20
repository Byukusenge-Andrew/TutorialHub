import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { DSAExercise, SubmissionResult } from '@/types/dsa';
import { Button } from '@/components/ui/button';
import { Editor } from '@/components/Editor';
import { TestCaseDisplay } from '@/components/ui/TestCaseDisplay';
import { Alert, AlertDescription } from '@/components/ui/alert';

import {
  Loader2, Play, RotateCcw, Clock, CheckCircle2, XCircle,
  ChevronRight, BookOpen, ListChecks, Lightbulb, BarChart2,
  Code2, Zap
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
];

const DIFF_COLORS: Record<string, string> = {
  easy: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  medium: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20',
  hard: 'text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/20',
};

function useTimer() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function DSAChallenge() {
  const { id } = useParams<{ id: string }>();
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [result, setResult] = useState<SubmissionResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('problem');
  const timer = useTimer();

  const { data: exercise, isLoading, error } = useQuery<DSAExercise>({
    queryKey: ['dsa-exercise', id],
    queryFn: () => api.dsa.getExercise(id!),
    retry: 2,
  });

  const initializedRef = React.useRef(false);
  useEffect(() => {
    if (exercise?.starterCode && !initializedRef.current) {
      initializedRef.current = true;
      setCode(exercise.starterCode);
    }
  }, [exercise]);

  const handleSubmit = useCallback(async () => {
    if (!code.trim()) {
      setResult({ success: false, error: 'Please write some code before submitting.', executionTime: 0, memoryUsed: 0, passedTestCases: 0, totalTestCases: 0 });
      setActiveTab('results');
      return;
    }
    try {
      setIsSubmitting(true);
      const res = await api.dsa.submitSolution(id!, code, language);
      setResult(res);
      setActiveTab('results');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Submission failed.';
      setResult({ success: false, error: msg, executionTime: 0, memoryUsed: 0, passedTestCases: 0, totalTestCases: 0 });
      setActiveTab('results');
    } finally {
      setIsSubmitting(false);
    }
  }, [id, code, language]);

  const handleRunTests = useCallback(async () => {
    if (!code.trim()) return;
    try {
      setIsRunning(true);
      const res = await api.dsa.runTests(id!, code, language);
      setResult(res);
      setActiveTab('testcases');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Test run failed.';
      setResult({ success: false, error: msg, executionTime: 0, memoryUsed: 0, passedTestCases: 0, totalTestCases: 0 });
    } finally {
      setIsRunning(false);
    }
  }, [id, code, language]);

  const handleReset = () => {
    setCode(exercise?.starterCode || '');
    setResult(null);
  };

  // Keyboard shortcut Ctrl+Enter
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!isSubmitting) handleSubmit();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleSubmit, isSubmitting]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] gap-3 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        Loading challenge…
      </div>
    );
  }

  if (error || !exercise) {
    return (
      <Alert variant="destructive" className="mx-auto max-w-2xl mt-8">
        <AlertDescription>{error ? (error as Error).message : 'Exercise not found.'}</AlertDescription>
      </Alert>
    );
  }

  const diffStyle = DIFF_COLORS[exercise.difficulty] || DIFF_COLORS.easy;
  const visibleTestCases = exercise.testCases.filter((tc) => !tc.isHidden);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-background/80 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-3">
          <Code2 className="h-4 w-4 text-primary" />
          <h1 className="font-semibold text-sm truncate max-w-[200px] md:max-w-none">{exercise.title}</h1>
          <span className={`hidden sm:inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full border ${diffStyle}`}>
            {exercise.difficulty}
          </span>
          <span className="hidden md:inline-flex text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {exercise.category}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span className="font-mono tabular-nums">{timer}</span>
        </div>
      </div>

      {/* Split panel */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        {/* LEFT — Problem */}
        <div className="lg:w-[45%] flex flex-col border-r border-border overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1 overflow-hidden">
            <div className="flex items-center gap-1 px-3 pt-2 border-b border-border bg-muted/40 shrink-0 overflow-x-auto">
              <TabsList className="bg-transparent h-auto p-0 gap-1">
                <TabsTrigger value="problem" className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  <BookOpen className="h-3.5 w-3.5" /> Problem
                </TabsTrigger>
                <TabsTrigger value="testcases" className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  <ListChecks className="h-3.5 w-3.5" /> Test Cases
                </TabsTrigger>
                {exercise.hints && exercise.hints.length > 0 && (
                  <TabsTrigger value="hints" className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    <Lightbulb className="h-3.5 w-3.5" /> Hints
                  </TabsTrigger>
                )}
                {result && (
                  <TabsTrigger value="results" className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    <BarChart2 className="h-3.5 w-3.5" />
                    Results
                    {result.success ? (
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                    ) : (
                      <XCircle className="h-3 w-3 text-destructive" />
                    )}
                  </TabsTrigger>
                )}
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto">
              <TabsContent value="problem" className="p-5 space-y-5 mt-0">
                <div>
                  <h2 className="text-xl font-bold mb-1">{exercise.title}</h2>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${diffStyle}`}>
                    {exercise.difficulty}
                  </span>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{exercise.description}</p>
                {exercise.constraints && (
                  <div className="bg-muted/60 rounded-xl p-4">
                    <h3 className="text-sm font-semibold mb-2">Constraints</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2"><ChevronRight className="h-3.5 w-3.5" /> Time Limit: {exercise.constraints.timeLimit}ms</li>
                      <li className="flex items-center gap-2"><ChevronRight className="h-3.5 w-3.5" /> Memory Limit: {exercise.constraints.memoryLimit}MB</li>
                    </ul>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="testcases" className="p-5 mt-0">
                <TestCaseDisplay testCases={visibleTestCases} result={result} />
              </TabsContent>

              {exercise.hints && exercise.hints.length > 0 && (
                <TabsContent value="hints" className="p-5 space-y-3 mt-0">
                  {exercise.hints.map((hint, i) => (
                    <div key={i} className="flex gap-3 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                      <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-muted-foreground">{hint}</p>
                    </div>
                  ))}
                </TabsContent>
              )}

              {result && (
                <TabsContent value="results" className="p-5 mt-0 space-y-4">
                  <div className={`flex items-start gap-4 p-5 rounded-xl border ${result.success ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-destructive/10 border-destructive/20'}`}>
                    {result.success ? (
                      <CheckCircle2 className="h-7 w-7 text-emerald-500 shrink-0" />
                    ) : (
                      <XCircle className="h-7 w-7 text-destructive shrink-0" />
                    )}
                    <div>
                      <h3 className={`text-base font-bold ${result.success ? 'text-emerald-700 dark:text-emerald-400' : 'text-destructive'}`}>
                        {result.success ? '🎉 All Tests Passed!' : 'Some Tests Failed'}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {result.passedTestCases}/{result.totalTestCases} test cases passed
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Execution Time', value: `${result.executionTime}ms`, icon: Clock },
                      { label: 'Memory Used', value: `${result.memoryUsed}MB`, icon: BarChart2 },
                    ].map(({ label, value, icon: Icon }) => (
                      <div key={label} className="bg-muted/60 rounded-xl p-3">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                          <Icon className="h-3.5 w-3.5" /> {label}
                        </div>
                        <p className="text-lg font-bold">{value}</p>
                      </div>
                    ))}
                  </div>

                  {result.error && (
                    <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4">
                      <p className="text-xs font-semibold text-destructive mb-1">Error</p>
                      <pre className="text-xs text-muted-foreground whitespace-pre-wrap">{result.error}</pre>
                    </div>
                  )}
                </TabsContent>
              )}
            </div>
          </Tabs>
        </div>

        {/* RIGHT — Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Editor toolbar */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/40 shrink-0">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-36 h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((l) => (
                  <SelectItem key={l.value} value={l.value} className="text-xs">{l.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex-1" />
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-accent"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </button>
          </div>

          {/* Monaco */}
          <div className="flex-1 overflow-hidden">
            <Editor
              value={code}
              onChange={setCode}
              language={language}
              defaultValue={exercise.starterCode}
              className="h-full"
            />
          </div>

          {/* Action bar */}
          <div className="flex items-center gap-3 px-4 py-3 border-t border-border bg-background/80 backdrop-blur-sm shrink-0">
            <Button
              variant="outline"
              onClick={handleRunTests}
              disabled={isRunning || isSubmitting}
              size="sm"
              className="flex items-center gap-1.5"
            >
              {isRunning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Zap className="h-3.5 w-3.5" />}
              Run Tests
            </Button>
            <div className="flex-1" />
            <p className="text-xs text-muted-foreground hidden sm:block">
              <kbd className="px-1 py-0.5 bg-muted border border-border rounded text-xs font-mono">Ctrl</kbd>+<kbd className="px-1 py-0.5 bg-muted border border-border rounded text-xs font-mono">↵</kbd>
            </p>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || isRunning}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</>
              ) : (
                <><Play className="h-4 w-4" /> Submit Solution</>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}