import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import User from '../models/User';
import { AppError } from '../utils/errors';
import { sendVerificationEmail } from '../utils/email';
import crypto from 'crypto';

class VerificationController {
  // Send verification email
  sendVerificationEmail = catchAsync(async (req: Request, res: Response) => {
    const { email } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('User not found', 404);
    }
    
    if (user.isVerified) {
      return res.status(200).json({
        status: 'success',
        message: 'Email is already verified'
      });
    }
    
    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    // Save token to user
    user.verificationToken = verificationToken;
    user.verificationTokenExpiry = verificationTokenExpiry;
    await user.save();
    
    // Send verification email
    try {
      await sendVerificationEmail(email, user.name, verificationToken);
      
      res.status(200).json({
        status: 'success',
        message: 'Verification email sent'
      });
    } catch (error) {
      // If email fails, remove the verification token
      user.verificationToken = undefined;
      user.verificationTokenExpiry = undefined;
      await user.save();
      
      throw new AppError('Failed to send verification email', 500);
    }
  });
  
  // Verify email with token
  verifyEmail = catchAsync(async (req: Request, res: Response) => {
    const { token } = req.params;
    
    // Find user with valid token
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: Date.now() }
    });
    
    if (!user) {
      throw new AppError('Invalid or expired verification token', 400);
    }
    
    // Update user verification status
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();
    
    res.status(200).json({
      status: 'success',
      message: 'Email verified successfully'
    });
  });
  
  // Resend verification email
  resendVerificationEmail = catchAsync(async (req: Request, res: Response) => {
    const { email } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal that the user doesn't exist
      return res.status(200).json({
        status: 'success',
        message: 'If your email is registered, you will receive a verification email'
      });
    }
    
    if (user.isVerified) {
      return res.status(200).json({
        status: 'success',
        message: 'Email is already verified'
      });
    }
    
    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    // Save token to user
    user.verificationToken = verificationToken;
    user.verificationTokenExpiry = verificationTokenExpiry;
    await user.save();
    
    // Send verification email
    try {
      await sendVerificationEmail(email, user.name, verificationToken);
      
      res.status(200).json({
        status: 'success',
        message: 'Verification email sent'
      });
    } catch (error) {
      // If email fails, remove the verification token
      user.verificationToken = undefined;
      user.verificationTokenExpiry = undefined;
      await user.save();
      
      throw new AppError('Failed to send verification email', 500);
    }
  });
}

export default new VerificationController(); 