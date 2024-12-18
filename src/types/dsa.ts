export interface TestCase {
  input: any;
  output: any;
  explanation?: string;
  isHidden?: boolean;
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