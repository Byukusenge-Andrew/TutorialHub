import { Document, Schema, model } from 'mongoose';

export interface IProgress extends Document {
  userId: string;
  tutorialId: string;
  completedSections: string[];
  progress: number;
  lastAccessedAt: Date;
}

const ProgressSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  tutorialId: { type: Schema.Types.ObjectId, ref: 'Tutorial', required: true },
  completedSections: [{ type: String }],
  progress: { type: Number, default: 0 },
  lastAccessedAt: { type: Date, default: Date.now }
});

export default model<IProgress>('Progress', ProgressSchema); 