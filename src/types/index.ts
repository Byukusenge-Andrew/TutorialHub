export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
}
export interface TutorialProgress {
  tutorialId: string;
  userId: string;
  progress: number;
  lastAccessedAt: string;
  completedSections: string[];
}

export interface Tutorial {
  _id: string;
  title: string;
  description: string;
  sections: Section[];
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  rating: number;
  totalRatings: number;
  authorId: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface TutorialResponse {
  status: string;
  results: number;
  data: {
    tutorials: Tutorial[];
  };
}

export interface Progress {
  id: string;
  userId: string;
  tutorialId: string;
  completedSections: string[];
  progress: number;
  lastAccessedAt: Date;
}

export interface Section {
  _id: string;
  title: string;
  content: string;
  order: number;
  parentId?: string;
  subsections?: Section[];
}

export interface TypingStats {
  wpm: number;
  accuracy: number;
  time: number;
  timestamp: string;
}

export interface TestCase {
  input: any;
  output: any;
  explanation?: string;
  isHidden?: boolean;
}

export interface DSAChallenge {
  _id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  testCases: TestCase[];
  timeLimit: number; // in milliseconds
  memoryLimit: number; // in MB
  submissions: number;
  successfulSubmissions: number;
  successRate: number;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  status: string;
  data: T;
}

export * from './auth';
export * from './dsa';