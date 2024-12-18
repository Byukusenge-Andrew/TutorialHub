import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthError } from '../utils/errors';
import User from '../models/User';

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new AuthError('No token provided');
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Check if user still exists
    const user = await User.findById((decoded as any).id);
    if (!user) {
      throw new AuthError('User no longer exists');
    }

    // Grant access
    req.user = user;
    next();
  } catch (error) {
    next(new AuthError('Not authorized'));
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(new AuthError('Not authorized to access this route'));
    }
    next();
  };
}; 