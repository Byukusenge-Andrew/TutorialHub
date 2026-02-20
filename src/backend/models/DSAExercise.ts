import mongoose from 'mongoose';

const testCaseSchema = new mongoose.Schema({
  input: mongoose.Schema.Types.Mixed,
  expectedOutput: mongoose.Schema.Types.Mixed,
  isHidden: Boolean,
  explanation: String
});

const dsaExerciseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { 
    type: String, 
    enum: ['easy', 'medium', 'hard'],
    required: true 
  },
  category: { type: String, required: true },
  testCases: [testCaseSchema],
  starterCode: { type: String, required: true },
  solution: { type: String, required: true },
  constraints: {
    timeLimit: { type: Number, default: 5000 }, // ms
    memoryLimit: { type: Number, default: 256 } // MB
  },
  hints: [String],
  successRate: { type: Number, default: 0 },
  totalSubmissions: { type: Number, default: 0 },
  successfulSubmissions: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  tags: [String]
});

export const DSAExercise = mongoose.model('DSAExercise', dsaExerciseSchema); 