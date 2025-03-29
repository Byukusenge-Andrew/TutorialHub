import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { Plus, Save, Trash2, Play } from 'lucide-react';
import { useDSAStore } from '../../store/dsa-store';
import { TestCase } from '../../types';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useAuth } from '@/providers/AuthProvider';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// Add these type definitions
type InputFormat = 'array' | 'number' | 'string' | 'matrix';

interface ExerciseTemplate {
  inputFormat: InputFormat;
  starterCode: string;
  solutionCode: string;
}

// Add templates for different problem types
const problemTemplates: Record<InputFormat, ExerciseTemplate> = {
  array: {
    inputFormat: 'array',
    starterCode: `function solution(nums) {
  // Write your code here
  // nums is an array of numbers
  return [];
}`,
    solutionCode: `function solution(nums) {
  // Write your solution here
  return [];
}`
  },
  number: {
    inputFormat: 'number',
    starterCode: `function solution(n) {
  // Write your code here
  // n is a number
  return 0;
}`,
    solutionCode: `function solution(n) {
  // Write your solution here
  return 0;
}`
  },
  string: {
    inputFormat: 'string',
    starterCode: `function solution(str) {
  // Write your code here
  // str is a string
  return "";
}`,
    solutionCode: `function solution(str) {
  // Write your solution here
  return "";
}`
  },
  matrix: {
    inputFormat: 'matrix',
    starterCode: `function solution(matrix) {
  // Write your code here
  // matrix is an array of arrays
  return [[]];
}`,
    solutionCode: `function solution(matrix) {
  // Write your solution here
  return [[]];
}`
  }
};

// Update parse input function to handle different formats
function parseInput(input: string, format: InputFormat): any {
  switch (format) {
    case 'array':
      return input.split(',')
        .map(num => num.trim())
        .filter(num => num.length > 0)
        .map(num => Number(num));
    case 'number':
      return Number(input);
    case 'string':
      return input;
    case 'matrix':
      return input.split(';')
        .map(row => row.split(',')
          .map(num => num.trim())
          .filter(num => num.length > 0)
          .map(num => Number(num)));
    default:
      throw new Error('Unsupported input format');
  }
}

function runSolutionInSandbox(solutionCode: string, input: any, format: InputFormat): any {
  try {
    // Create a function from the solution code
    const solutionFunc = new Function('return ' + solutionCode)();
    
    // Validate function exists
    if (typeof solutionFunc !== 'function') {
      throw new Error('Code must define a solution function');
    }

    // Run solution with timeout
    const startTime = Date.now();
    const result = solutionFunc(input);
    
    // Check time limit
    if (Date.now() - startTime > 2000) {
      throw new Error('Time limit exceeded (2 seconds)');
    }

    // Validate result based on format
    switch (format) {
      case 'array':
        if (!Array.isArray(result)) {
          throw new Error('Solution must return an array');
        }
        break;
      case 'number':
        if (typeof result !== 'number') {
          throw new Error('Solution must return a number');
        }
        break;
      case 'string':
        if (typeof result !== 'string') {
          throw new Error('Solution must return a string');
        }
        break;
      case 'matrix':
        if (!Array.isArray(result) || !result.every(Array.isArray)) {
          throw new Error('Solution must return a matrix (array of arrays)');
        }
        break;
    }

    if (result === undefined || result === null) {
      throw new Error('Solution must return a value');
    }

    return result;
  } catch (error) {
    throw error;
  }
}

// Add this helper function for array comparison
function compareArrays(arr1: number[], arr2: number[]): boolean {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((val, idx) => val === arr2[idx]);
}

export function CreateDSAChallenge() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addChallenge } = useDSAStore();
  const [isLoading, setIsLoading] = useState(true);
  const [exercise, setExercise] = useState({
    title: '',
    description: '',
    difficulty: 'medium',
    category: '',
    inputFormat: 'array' as InputFormat,
    starterCode: problemTemplates.array.starterCode,
    solution: problemTemplates.array.solutionCode,
    testCases: [{ input: '', expectedOutput: '', isHidden: false }]
  });
  const [testResults, setTestResults] = useState<Array<{ success: boolean; error?: string }>>([]);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'admin') {
      navigate('/dsa');
      return;
    }
    setIsLoading(false);
  }, [user, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if solution is empty or just the template
    if (exercise.solution === problemTemplates[exercise.inputFormat].solutionCode) {
      toast.error('Please provide a solution before creating the challenge');
      return;
    }

    try {
      const challengeData = {
        ...exercise,
        starterCode: {
          javascript: exercise.starterCode,
          typescript: exercise.starterCode.replace('function', 'function (nums: number[])'),
          python: exercise.starterCode
            .replace('function', 'def')
            .replace('{', ':')
            .replace('}', '')
            .replace('return', '    return')
        },
        authorId: user?._id
      };

      const response = await api.dsa.createChallenge(challengeData);
      
      if (response.status === 'success') {
        toast.success('Challenge created successfully!');
        navigate('/dsa');
      }
    } catch (error) {
      console.error('Failed to create exercise:', error);
      toast.error('Failed to create challenge');
    }
  };

  const addTestCase = () => {
    setExercise(prev => ({
      ...prev,
      testCases: [...prev.testCases, { input: '', expectedOutput: '', isHidden: false }]
    }));
  };

  const validateSolution = async () => {
    setIsValidating(true);
    try {
      // Check if solution is empty or just the template
      if (exercise.solution === problemTemplates[exercise.inputFormat].solutionCode) {
        toast.error('Please enter your solution before testing');
        setIsValidating(false);
        return;
      }

      const results = exercise.testCases.map((testCase) => {
        try {
          if (!testCase.input || !testCase.expectedOutput) {
            return { success: false, error: 'Test case input and expected output are required' };
          }

          // Parse input and expected output
          const input = parseInput(testCase.input, exercise.inputFormat);
          const expectedOutput = parseInput(testCase.expectedOutput, exercise.inputFormat);

          // Run solution with format
          const output = runSolutionInSandbox(exercise.solution, input, exercise.inputFormat);

          // Compare results based on format
          let success = false;
          switch (exercise.inputFormat) {
            case 'array':
            case 'matrix':
              success = JSON.stringify(output) === JSON.stringify(expectedOutput);
              break;
            case 'number':
              success = output === expectedOutput;
              break;
            case 'string':
              success = output === expectedOutput;
              break;
          }

          return {
            success,
            error: success ? undefined : 'Output does not match expected result'
          };
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Invalid test case format'
          };
        }
      });

      setTestResults(results);

      const allPassed = results.every(r => r.success);
      if (allPassed) {
        toast.success('All tests passed!');
      } else {
        toast.error('Some tests failed');
      }
    } catch (error) {
      console.error('Validation failed:', error);
      toast.error('Failed to validate solution');
    } finally {
      setIsValidating(false);
    }
  };

  const updateTestCase = (index: number, field: keyof TestCase, value: string | boolean) => {
    setExercise(prev => ({
      ...prev,
      testCases: prev.testCases.map((tc, i) => 
        i === index 
          ? { ...tc, [field]: value }
          : tc
      )
    }));
  };

  const removeTestCase = (index: number) => {
    setExercise(prev => ({
      ...prev,
      testCases: prev.testCases.filter((_, i) => i !== index)
    }));
  };

  // Update placeholder text based on format
  const getPlaceholder = (format: InputFormat) => {
    switch (format) {
      case 'array': return "1, 2, 3, 4, 5";
      case 'number': return "42";
      case 'string': return "hello";
      case 'matrix': return "1,2,3; 4,5,6; 7,8,9";
      default: return "";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create DSA Exercise</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6">
          <div className="grid gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
              <Input
                id="title"
                name="title"
                type="text"
                value={exercise.title}
                onChange={e => setExercise({ ...exercise, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
              <textarea
                id="description"
                className="min-h-[100px] p-2 border rounded w-full"
                placeholder="Exercise description..."
                value={exercise.description}
                onChange={e => setExercise({ ...exercise, description: e.target.value })}
                required
              />
            </div>

            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium mb-1">Difficulty</label>
              <Select
                value={exercise.difficulty}
                onValueChange={value => setExercise({ ...exercise, difficulty: value })}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </Select>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-1">Category</label>
              <Input
                id="category"
                name="category"
                type="text"
                value={exercise.category}
                onChange={e => setExercise({ ...exercise, category: e.target.value })}
                required
              />
            </div>

            <div>
              <label htmlFor="format" className="block text-sm font-medium mb-1">Input Format</label>
              <Select
                value={exercise.inputFormat}
                onValueChange={(value) => {
                  setExercise(prev => ({
                    ...prev,
                    inputFormat: value as InputFormat,
                    starterCode: problemTemplates[value as InputFormat].starterCode,
                    solution: problemTemplates[value as InputFormat].solutionCode
                  }));
                }}
              >
                <option value="array">Array</option>
                <option value="number">Number</option>
                <option value="string">String</option>
                <option value="matrix">Matrix</option>
              </Select>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Starter Code</h2>
          <Editor
            height="300px"
            defaultLanguage="javascript"
            value={exercise.starterCode}
            onChange={value => setExercise({ ...exercise, starterCode: value || '' })}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              automaticLayout: true,
            }}
          />
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Solution</h2>
          <Editor
            height="300px"
            defaultLanguage="javascript"
            value={exercise.solution}
            onChange={value => setExercise({ ...exercise, solution: value || '' })}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              automaticLayout: true,
            }}
          />
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Test Cases</h2>
            <Button onClick={addTestCase} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Test Case
            </Button>
          </div>

          <div className="space-y-4">
            {exercise.testCases.map((testCase, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">Test Case {index + 1}</h3>
                  <div className="flex items-center gap-2">
                    {testResults[index] && (
                      <Badge variant={testResults[index].success ? "success" : "destructive"}>
                        {testResults[index].success ? "Passed" : "Failed"}
                      </Badge>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeTestCase(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Input</label>
                    <Input
                      value={testCase.input}
                      onChange={e => updateTestCase(index, 'input', e.target.value)}
                      placeholder={getPlaceholder(exercise.inputFormat)}
                    />
                    {testResults[index]?.error && (
                      <p className="text-sm text-red-500 mt-1">{testResults[index].error}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Expected Output</label>
                    <Input
                      value={testCase.expectedOutput}
                      onChange={e => updateTestCase(index, 'expectedOutput', e.target.value)}
                      placeholder={getPlaceholder(exercise.inputFormat)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`hidden-${index}`}
                      checked={testCase.isHidden}
                      onChange={e => updateTestCase(index, 'isHidden', e.target.checked)}
                    />
                    <label htmlFor={`hidden-${index}`} className="text-sm">
                      Hidden test case
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-4">
            <Button onClick={addTestCase} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Test Case
            </Button>
            <Button 
              onClick={validateSolution}
              disabled={isValidating || exercise.testCases.length === 0}
              className="w-32"
            >
              {isValidating ? (
                <>
                  <span className="animate-spin mr-2">⌛</span>
                  Testing...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Test
                </>
              )}
            </Button>
          </div>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => navigate('/dsa')}>
            Cancel
          </Button>
          <Button type="submit">Create Exercise</Button>
        </div>
      </form>
    </div>
  );
}