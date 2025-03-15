import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthError } from '../utils/errors';
import User from '../models/User';

export interface AuthRequest extends Request {
  user?: any;
  body: any;
  params: any;
  headers: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    console.log('Token:', token);
    if (!token) {
      throw new AuthError('No token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    const user = await User.findById((decoded as any).id);

    if (!user) {
      throw new AuthError('User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authorization error:', error);
    next(new AuthError('Not authorized'));
  }
};

export const authorizeAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    throw new AuthError('No token provided');
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
  next();
};