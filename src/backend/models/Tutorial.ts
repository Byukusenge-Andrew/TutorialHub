import { Document, Schema, model } from 'mongoose';

export interface Section {
  title: string;
  content: string;
  order: number;
  id: string;
}

export interface ITutorial extends Document {
  title: string;
  description: string;
  content: string;
  authorId: string;
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  rating: number;
  totalRatings: number;
  sections: Section[];
}

const TutorialSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  tags: [{ type: String }],
  rating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  sections: [{
    title: { type: String, required: true },
    content: { type: String, required: true },
    order: { type: Number, required: true }
  }]
}, {
  timestamps: true
});

export default model<ITutorial>('Tutorial', TutorialSchema); 