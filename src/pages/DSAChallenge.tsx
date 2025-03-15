import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { DSAExercise, SubmissionResult } from '@/types/dsa';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Editor } from '@/components/Editor';
import { TestCaseDisplay } from '@/components/TestCaseDisplay';

export function DSAChallenge() {
  const { id } = useParams<{ id: string }>();
  const [code, setCode] = useState('');
  const [result, setResult] = useState<SubmissionResult | null>(null);

  const { data: exercise, isLoading } = useQuery<DSAExercise>({
    queryKey: ['dsa-exercise', id],
    queryFn: () => api.dsa.getExercise(id!)
  });

  const handleSubmit = async () => {
    try {
      const result = await api.dsa.submitSolution(id!, code, 'javascript');
      setResult(result);
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!exercise) return <div>Exercise not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card className="p-6">
            <h1 className="text-2xl font-bold mb-4">{exercise.title}</h1>
            <div className="prose dark:prose-invert">
              <p>{exercise.description}</p>
            </div>
          </Card>

          {/* Test Cases */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Test Cases</h2>
            <TestCaseDisplay 
              testCases={exercise.testCases.filter(tc => !tc.isHidden)}
              result={result}
            />
          </Card>
        </div>

        {/* Right side - Code editor */}
        <div className="space-y-4">
          <Editor
            value={code}
            onChange={setCode}
            language="javascript"
            defaultValue={exercise.starterCode}
          />
          <Button onClick={handleSubmit} className="w-full">
            Submit Solution
          </Button>
        </div>
      </div>
    </div>
  );
}