import { Request, Response } from 'express';
import AuthService from '../services/AuthService';
import { catchAsync } from '../utils/catchAsync';
import { AuthRequest } from '../middleware/auth';
import { sendWelcomeEmail, sendVerificationEmail } from '../utils/email';
import User from '../models/User';
import { generateToken } from '../utils/token';
import crypto from 'crypto';

export class AuthController {
  register = catchAsync(async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    
    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    const user = await User.create({
      name,
      email,
      password,
      verificationToken,
      verificationTokenExpiry,
      isVerified: false  // Set to false to require email verification
    });

    // Send welcome and verification emails
    try {
      await sendWelcomeEmail(email, name);
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      // Continue registration process even if email fails
    }

    try {
      await sendVerificationEmail(email, name, verificationToken);
    } catch (error) {
      console.error('Failed to send verification email:', error);
      // Continue registration process even if email fails
    }

    const token = generateToken(user);

    res.status(201).json({
      status: 'success',
      data: {
        user,
        token
      }
    });
  });

  login = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const { user, token } = await AuthService.login(email, password);
    
    // Check if user is verified
    if (!user.isVerified) {
      return res.status(401).json({
        status: 'error',
        message: 'Please verify your email address before logging in',
        needsVerification: true
      });
    }
    
    console.log('Login response:', { user, token });

    res.status(200).json({
      status: 'success',
      data: {
        user,
        token
      }
    });
  });

  validate = catchAsync(async (req: AuthRequest, res: Response) => {
    const { user } = req;
    
    res.status(200).json({
      status: 'success',
      data: { user }
    });
  });
}

export default new AuthController(); 