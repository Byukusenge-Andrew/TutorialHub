import React from 'react';
import { TestCase, SubmissionResult } from '@/types/dsa';
import { CheckCircle, XCircle } from 'lucide-react';

interface TestCaseDisplayProps {
  testCases: TestCase[];
  result: SubmissionResult | null;
}

export function TestCaseDisplay({ testCases, result }: TestCaseDisplayProps) {
  return (
    <div className="space-y-4">
      {testCases.map((testCase, index) => (
        <div key={index} className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Test Case {index + 1}</h3>
            {result && (
              <span>
                {result.success ? (
                  <CheckCircle className="text-green-500 h-5 w-5" />
                ) : (
                  <XCircle className="text-red-500 h-5 w-5" />
                )}
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Input:</p>
              <pre className="mt-1 p-2 bg-muted rounded text-sm">
                {testCase.input}
              </pre>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Expected Output:</p>
              <pre className="mt-1 p-2 bg-muted rounded text-sm">
                {testCase.expectedOutput}
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
  );
}