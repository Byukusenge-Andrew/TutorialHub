import { Document, Schema, model } from 'mongoose';

export interface IPost extends Document {
  title: string;
  content: string;
  authorId: Schema.Types.ObjectId;
  likes: number;
  comments: [{
    content: string;
    authorId: Schema.Types.ObjectId;
    createdAt: Date;
  }];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  likes: { type: Number, default: 0 },
  comments: [{
    content: { type: String, required: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  tags: [{ type: String }]
}, {
  timestamps: true
});

export default model<IPost>('Post', PostSchema); 