import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { AppError } from '../utils/errors';

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation Error', 400)
  }
  next();
};

export const validateSubmission = (req: Request, res: Response, next: NextFunction) => {
  const { code, language } = req.body;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({
      status: 'error',
      message: 'Code is required and must be a string'
    });
  }

  if (!language || !['javascript', 'python', 'java'].includes(language.toLowerCase())) {
    return res.status(400).json({
      status: 'error',
      message: 'Valid programming language is required'
    });
  }

  // Add code length limit
  if (code.length > 50000) {
    return res.status(400).json({
      status: 'error',
      message: 'Code length exceeds limit'
    });
  }

  next();
};
