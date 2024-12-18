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
  content: string;
  author: User;
  category: string;
  tags: string[];
  sections: Section[];
  createdAt: string;
  updatedAt: string;
  videoUrl?: string;
  rating: number;
  totalRatings: number;
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
  id: string;
  title: string;
  content: string;
  order: number;
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

export * from './auth';
export * from './dsa';