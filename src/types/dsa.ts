export interface DSAExercise {
  successRate: number;
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  testCases: TestCase[];
  starterCode: string;
  solution: string;
  constraints: {
    timeLimit: number; // in milliseconds
    memoryLimit: number; // in MB
  };
  hints?: string[];
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
  explanation?: string;
}

export interface SubmissionResult {
  success: boolean;
  executionTime: number;
  memoryUsed: number;
  passedTestCases: number;
  totalTestCases: number;
  failedTestCase?: {
    input: string;
    expected: string;
    received: string;
    explanation?: string;
  };
  error?: string;
}

export interface DSAChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  tags: string[];
  starterCode: string;
  testCases: TestCase[];
  constraints: string[];
  timeLimit: number; // in milliseconds
  memoryLimit: number; // in MB
  successRate: number;
  submissions: number;
  successfulSubmissions: number;
} 