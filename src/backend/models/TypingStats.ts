import { Document, Schema, model } from 'mongoose';

export interface ITypingStats extends Document {
  userId: Schema.Types.ObjectId;
  wpm: number;
  accuracy: number;
  duration: number;
  characters: number;
  errors: number;
  date: Date;
}

const TypingStatsSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  wpm: { type: Number, required: true },
  accuracy: { type: Number, required: true },
  duration: { type: Number, required: true }, // in seconds
  characters: { type: Number, required: true },
  errors: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

// Add indexes for better query performance
TypingStatsSchema.index({ userId: 1, date: -1 });
TypingStatsSchema.index({ wpm: -1 }); // For leaderboard queries

export default model<ITypingStats>('TypingStats', TypingStatsSchema); 