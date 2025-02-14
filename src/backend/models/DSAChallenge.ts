import { Document, Schema, model } from 'mongoose';

export interface TestCase {
  input: any;
  output: any;
  explanation?: string;
  isHidden?: boolean;
}

export interface Submission {
  userId: Schema.Types.ObjectId;
  code: string;
  language: string;
  passed: boolean;
  executionTime: number;
  memory: number;
  failedTestCase?: number;
  createdAt: Date;
}

export interface IDSAChallenge extends Document {
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  tags: string[];
  starterCode: {
    javascript: string;
    typescript: string;
    python: string;
  };
  testCases: TestCase[];
  submissions: Submission[];
  authorId: Schema.Types.ObjectId;
  timeLimit: number;
  memoryLimit: number;
  successRate: number;
  totalSubmissions: number;
  successfulSubmissions: number;
  createdAt: Date;
  updatedAt: Date;
}

const DSAChallengeSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  category: { type: String, required: true },
  tags: [{ type: String }],
  starterCode: {
    javascript: { type: String, required: true },
    typescript: { type: String, required: true },
    python: { type: String, required: true }
  },
  testCases: [{
    input: Schema.Types.Mixed,
    output: Schema.Types.Mixed,
    explanation: String,
    isHidden: { type: Boolean, default: false }
  }],
  submissions: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    code: String,
    language: String,
    passed: Boolean,
    executionTime: Number,
    memory: Number,
    failedTestCase: Number,
    createdAt: { type: Date, default: Date.now }
  }],
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  timeLimit: { type: Number, default: 2000 }, // in milliseconds
  memoryLimit: { type: Number, default: 128 }, // in MB
  successRate: { type: Number, default: 0 },
  totalSubmissions: { type: Number, default: 0 },
  successfulSubmissions: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Add indexes for better query performance
DSAChallengeSchema.index({ difficulty: 1, category: 1 });
DSAChallengeSchema.index({ tags: 1 });

export default model<IDSAChallenge>('DSAChallenge', DSAChallengeSchema); 