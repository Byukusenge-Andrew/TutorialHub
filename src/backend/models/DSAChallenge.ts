import { Document, Schema, model } from 'mongoose';

export interface TestCase {
  input: any;
  output: any;
  explanation?: string;
  isHidden?: boolean;
}

export interface IDSAChallenge extends Document {
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  tags: string[];
  starterCode: string;
  testCases: TestCase[];
  constraints: string[];
  timeLimit: number;
  memoryLimit: number;
  successRate: number;
  submissions: number;
  successfulSubmissions: number;
  authorId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const DSAChallengeSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  category: { type: String, required: true },
  tags: [{ type: String }],
  starterCode: { type: String, required: true },
  testCases: [{
    input: Schema.Types.Mixed,
    output: Schema.Types.Mixed,
    explanation: String,
    isHidden: { type: Boolean, default: false }
  }],
  constraints: [{ type: String }],
  timeLimit: { type: Number, default: 2000 },
  memoryLimit: { type: Number, default: 128 },
  successRate: { type: Number, default: 0 },
  submissions: { type: Number, default: 0 },
  successfulSubmissions: { type: Number, default: 0 },
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

export default model<IDSAChallenge>('DSAChallenge', DSAChallengeSchema); 