import { Document, Schema, model } from 'mongoose';

export interface ITypingStats extends Omit<Document, 'errors'> {
  userId: Schema.Types.ObjectId;
  wpm: number;
  accuracy: number;
  duration: number;
  characters: number;
  errors: number;
  date: Date;
}

const TypingStatsSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true 
  },
  wpm: { 
    type: Number, 
    required: true,
    min: 0 
  },
  accuracy: { 
    type: Number, 
    required: true,
    min: 0,
    max: 100 
  },
  duration: { 
    type: Number, 
    required: true,
    min: 0 
  },
  characters: { 
    type: Number, 
    required: true,
    min: 0 
  },
  errors: { 
    type: Number, 
    required: true,
    min: 0 
  },
  date: { 
    type: Date, 
    default: Date.now,
    index: true 
  }
});

// Compound index for efficient user history queries
TypingStatsSchema.index({ userId: 1, date: -1 });

// Index for leaderboard queries
TypingStatsSchema.index({ wpm: -1 });

export default model<ITypingStats>('TypingStats', TypingStatsSchema); 