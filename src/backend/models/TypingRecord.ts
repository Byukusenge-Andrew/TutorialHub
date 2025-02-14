import { Document, Schema, model } from 'mongoose';

export interface ITypingRecord extends Document {
  userId: string;
  wpm: number;
  accuracy: number;
  score: number;
  duration: number;
  date: Date;
}

const TypingRecordSchema = new Schema({
  userId: { type: String, required: true },
  wpm: { type: Number, required: true },
  accuracy: { type: Number, required: true },
  score: { type: Number, required: true },
  duration: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

// Index for faster leaderboard queries
TypingRecordSchema.index({ score: -1 });

export default model<ITypingRecord>('TypingRecord', TypingRecordSchema); 