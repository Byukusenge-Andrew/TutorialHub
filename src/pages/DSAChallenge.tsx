import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, Check, X } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { useAuthStore } from '@/store/auth-store';

interface TestCase {
  input: any;
  output: any;
  explanation?: string;
}

interface Challenge {
  _id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  tags: string[];
  starterCode: {
    javascript: string;
    typescript: string;
    python: string;
  };
  testCases: TestCase[];
  successRate: number;
  authorId: {
    name: string;
  };
}

interface TestResult {
  passed: boolean;
  executionTime: number;
  memory: number;
  error?: string;
  failedTestCase?: number;
  output?: any;
}

interface ChallengeResponse {
  data: Challenge;
}

export function DSAChallenge() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuthStore();
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [results, setResults] = useState<TestResult | null>(null);

  const { data: challenge, isLoading } = useQuery<Challenge, Error>({
    queryKey: ['dsa-challenge', id],
    queryFn: async () => {
      const res = await api.dsa.getChallenge(id!) as ChallengeResponse;
      return res.data;
    },
    enabled: !!id
  });

  useEffect(() => {
    if (challenge) {
      setCode(challenge.starterCode[language as keyof typeof challenge.starterCode]);
    }
  }, [challenge, language]);
  const submitMutation = useMutation<TestResult, Error>({
    mutationFn: async () => {
      const result = await api.dsa.submitSolution(id!, code, language);
      return result as TestResult;
    },
    onSuccess: (data) => {
      setResults(data);
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Challenge not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/dsa"
        className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Challenges
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-card rounded-lg p-6 border border-border">
            <h1 className="text-3xl font-bold mb-4">{challenge.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <span>By {challenge.authorId.name}</span>
              <span>•</span>
              <span>{challenge.successRate.toFixed(1)}% success rate</span>
            </div>
            <div className="prose dark:prose-invert max-w-none">
              {challenge.description}
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border">
            <h2 className="text-xl font-semibold mb-4">Test Cases</h2>
            <div className="space-y-4">
              {challenge.testCases.map((testCase, index) => (
                <div key={index} className="p-4 bg-card/50 rounded-lg border border-border">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium mb-2">Input</h3>
                      <pre className="bg-background p-2 rounded">
                        {JSON.stringify(testCase.input, null, 2)}
                      </pre>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Expected Output</h3>
                      <pre className="bg-background p-2 rounded">
                        {JSON.stringify(testCase.output, null, 2)}
                      </pre>
                    </div>
                  </div>
                  {testCase.explanation && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {testCase.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                setCode(challenge.starterCode[e.target.value as keyof typeof challenge.starterCode]);
              }}
              className="px-4 py-2 border border-border rounded-md bg-background"
            >
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
            </select>

            <Button
              onClick={() => submitMutation.mutate()}
              disabled={!isAuthenticated || submitMutation.isPending}
            >
              <Play className="w-4 h-4 mr-2" />
              {submitMutation.isPending ? 'Running...' : 'Run Code'}
            </Button>
          </div>

          <div className="h-[600px] border border-border rounded-lg overflow-hidden">
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true
              }}
            />
          </div>

          {results && (
            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-center gap-2 mb-4">
                {results.passed ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <X className="w-5 h-5 text-red-500" />
                )}
                <h2 className="text-xl font-semibold">
                  {results.passed ? 'All Tests Passed!' : 'Test Failed'}
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-sm text-muted-foreground">Execution Time</span>
                  <p className="font-medium">{results.executionTime.toFixed(2)}ms</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Memory Used</span>
                  <p className="font-medium">{results.memory.toFixed(2)}MB</p>
                </div>
              </div>

              {!results.passed && (
                <div className="space-y-2">
                  {results.error ? (
                    <div className="p-4 bg-red-500/10 text-red-500 rounded">
                      {results.error}
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground">
                        Failed on Test Case {results.failedTestCase! + 1}:
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium mb-1">Expected</h3>
                          <pre className="bg-background p-2 rounded text-sm">
                            {JSON.stringify(challenge.testCases[results.failedTestCase!].output, null, 2)}
                          </pre>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium mb-1">Your Output</h3>
                          <pre className="bg-background p-2 rounded text-sm">
                            {JSON.stringify(results.output, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}