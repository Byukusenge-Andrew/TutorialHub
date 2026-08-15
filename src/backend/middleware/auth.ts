import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthError } from '../utils/errors';
import User from '../models/User';

export interface AuthRequest extends Request {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new AuthError('No token provided');
    }
    
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.split(' ')[1] 
      : authHeader;

    const jwtSecret = process.env.JWT_SECRET || 'default-secret-change-in-production-mode';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let decoded: any;
    try {
      decoded = jwt.verify(token, jwtSecret);
    } catch (err) {
      throw new AuthError('Invalid or expired authentication token');
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      throw new AuthError('User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error instanceof AuthError ? error : new AuthError('Not authorized'));
  }
};

export const authorizeAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1] || authHeader;
    if (!token) {
      throw new AuthError('No token provided');
    }
    const jwtSecret = process.env.JWT_SECRET || 'default-secret-change-in-production-mode';
    jwt.verify(token, jwtSecret);
    next();
  } catch (error) {
    next(new AuthError('Not authorized as admin'));
  }
};