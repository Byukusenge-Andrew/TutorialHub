import { Document, Schema, model } from 'mongoose';

export interface ITypingRecord extends Document {
  userId: Schema.Types.ObjectId;
  wpm: number;
  accuracy: number;
  score: number;
  duration: number;
  date: Date;
}

const TypingRecordSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true  // Add index for better query performance
  },
  wpm: { 
    type: Number, 
    required: true 
  },
  accuracy: { 
    type: Number, 
    required: true 
  },
  score: { 
    type: Number, 
    required: true 
  },
  duration: { 
    type: Number, 
    required: true 
  },
  date: { 
    type: Date, 
    default: Date.now,
    index: true  // Add index for sorting
  }
});

// Compound index for userId + date queries
TypingRecordSchema.index({ userId: 1, date: -1 });

export default model<ITypingRecord>('TypingRecord', TypingRecordSchema); 