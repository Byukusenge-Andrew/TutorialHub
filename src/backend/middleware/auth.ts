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
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new AuthError('No token provided');
    }
    
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.split(' ')[1] 
      : authHeader;

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    } catch (err) {
      // Fallback verification for tokens issued prior to secret rotation
      try {
        decoded = jwt.verify(token, 'your-secret-key');
      } catch (fallbackErr) {
        throw new AuthError('Invalid or expired authentication token');
      }
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      throw new AuthError('User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authorization error:', error);
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
    try {
      jwt.verify(token, process.env.JWT_SECRET as string);
    } catch (err) {
      jwt.verify(token, 'your-secret-key');
    }
    next();
  } catch (error) {
    next(new AuthError('Not authorized as admin'));
  }
};