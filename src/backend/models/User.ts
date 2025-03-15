import { Document, Schema, model, models } from 'mongoose';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  resetToken?: string;
  resetTokenExpiry?: Date;
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

interface IUserDocument extends Document {
  isModified(path: string): boolean;
  password: string;
  resetToken?: string;
  resetTokenExpiry?: Date;
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpiry?: Date;
}

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationTokenExpiry: { type: Date }
  },
  {
    timestamps: true
  }
);

// Hash password before saving
UserSchema.pre<IUserDocument>('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Ensure the model is not redefined
const User = models.User || model<IUser>('User', UserSchema);

export default User;
