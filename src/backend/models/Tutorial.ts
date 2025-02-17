import { Document, Schema, model } from 'mongoose';

export interface Section {
  _id?: string;
  title: string;
  content: string;
  order: number;
}

export interface ITutorial extends Document {
  title: string;
  description: string;
  authorId: Schema.Types.ObjectId;
  category: string;
  tags: string[];
  rating: number;
  totalRatings: number;
  sections: Section[];
  createdAt: Date;
  updatedAt: Date;
}

const SectionSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  order: { type: Number, required: true }
}, { _id: false });

const TutorialSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  tags: [{ type: String }],
  rating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  sections: [SectionSchema]
}, {
  timestamps: true
});

export default model<ITutorial>('Tutorial', TutorialSchema); 