import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { Play, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { useDSAStore } from '../store/dsa-store';
import { TestCaseDisplay } from '../components/TestCaseDisplay';
import { DSAChallenge as DSAChallengeType, TestCase } from '@/types';
import { api } from '@/services/api';

interface TestResult {
  passed: boolean;
  input: any;
  expected: any;
  received: any;
  error?: string;
}

const LANGUAGE_TEMPLATES = {
  typescript: `/**
 * Write your solution here
 * @param {...any} args - The input arguments
 * @returns {any} - The result to be validated against the test cases
 */
function solution(...args) {
  // Your code here
  // Example: if input is [1, 2, 3], args will be [1, 2, 3]
  
  return null; // Replace with your solution
}`,
  javascript: `/**
 * Write your solution here
 * @param {...any} args - The input arguments
 * @returns {any} - The result to be validated against the test cases
 */
function solution(...args) {
  // Your code here
  // Example: if input is [1, 2, 3], args will be [1, 2, 3]
  
  return null; // Replace with your solution
}`,
};

export function DSAChallenge() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [language, setLanguage] = useState<'typescript' | 'javascript'>('typescript');
  const [code, setCode] = useState(LANGUAGE_TEMPLATES[language]);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [challenge, setChallenge] = useState<DSAChallengeType | null>(null);

  useEffect(() => {
    const loadChallenge = async () => {
      try {
        const response = await api.dsa.getChallenges();
        const foundChallenge = response.data.challenges.find(c => c._id === id);
        if (!foundChallenge) {
          navigate('/dsa');
          return;
        }
        setChallenge(foundChallenge);
      } catch (error) {
        console.error('Failed to load challenge:', error);
        navigate('/dsa');
      }
    };
    loadChallenge();
  }, [id, navigate]);

  const validateSolution = (userCode: string, testCase: TestCase): TestResult => {
    try {
      // Create a safe function from user code
      const userFunction = new Function(
        'input',
        `
        ${userCode}
        try {
          // If input is an array, pass it directly
          const args = Array.isArray(input) ? [input] : Object.values(input);
          const result = solution(...args);
          
          // Validate result type matches expected output type
          if (Array.isArray(${JSON.stringify(testCase.output)}) !== Array.isArray(result)) {
            throw new Error('Return type mismatch');
          }
          return result;
        } catch (e) {
          throw new Error('Runtime error: ' + e.message);
        }
        `
      );

      // Run the test case
      const received = userFunction(testCase.input);
      const expected = testCase.output;

      // Deep equality check
      const isEqual = JSON.stringify(received) === JSON.stringify(expected);
      if (!isEqual) {
        throw new Error(`Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(received)}`);
      }

      return {
        passed: true,
        input: testCase.input,
        expected,
        received,
      };
    } catch (error) {
      return {
        passed: false,
        input: testCase.input,
        expected: testCase.output,
        received: null,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setResults([]);
    
    try {
      if (!challenge) return;
      
      const testResults = challenge.testCases.map((testCase: TestCase) => 
        validateSolution(code, testCase)
      );
      
      setResults(testResults);

      const allPassed = testResults.every((result: TestResult) => result.passed);
      if (allPassed) {
        await useDSAStore.getState().updateChallenge(challenge._id, {
          submissions: challenge.submissions + 1,
          successfulSubmissions: challenge.successfulSubmissions + 1,
        });
      }
    } catch (error) {
      console.error('Error executing code:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = (newLang: 'typescript' | 'javascript') => {
    setLanguage(newLang);
    setCode(LANGUAGE_TEMPLATES[newLang]);
  };

  if (!challenge) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{challenge.title}</h1>
          <p className="text-muted-foreground mt-2">{challenge.description}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${
          challenge.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
          challenge.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
        </span>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Your Solution</h2>
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value as 'typescript' | 'javascript')}
              className="px-2 py-1 border border-border rounded-md bg-background"
            >
              <option value="typescript">TypeScript</option>
              <option value="javascript">JavaScript</option>
            </select>
          </div>
          
          <div className="h-[600px] border border-border rounded-md overflow-hidden">
            <Editor
              defaultLanguage={language}
              defaultValue={LANGUAGE_TEMPLATES[language]}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                automaticLayout: true,
                tabSize: 2,
                formatOnPaste: true,
                formatOnType: true,
              }}
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" />
            {isLoading ? 'Running...' : 'Submit Solution'}
          </button>

          {results.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium">Test Results:</h3>
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-md ${
                    result.passed
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                      : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {result.passed ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <XCircle className="w-5 h-5" />
                    )}
                    <span className="font-medium">
                      Test Case {index + 1}: {result.passed ? 'Passed' : 'Failed'}
                    </span>
                  </div>
                  {!result.passed && (
                    <div className="space-y-2 text-sm">
                      {result.error ? (
                        <div className="font-mono bg-background/50 p-2 rounded">
                          Error: {result.error}
                        </div>
                      ) : (
                        <>
                          <div>Expected: {JSON.stringify(result.expected)}</div>
                          <div>Received: {JSON.stringify(result.received)}</div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Test Cases</h2>
          <div className="space-y-4">
            {challenge.testCases.map((testCase, index) => (
              <TestCaseDisplay
                key={index}
                input={testCase.input}
                output={testCase.output}
                explanation={testCase.explanation}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}