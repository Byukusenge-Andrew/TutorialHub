import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import User from '../models/User';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '../utils/email';
import { AppError } from '../utils/errors';

class PasswordController {
  // Request password reset
  forgotPassword = catchAsync(async (req: Request, res: Response) => {
    const { email } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal that the user doesn't exist
      return res.status(200).json({
        status: 'success',
        message: 'If your email is registered, you will receive a password reset link'
      });
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    
    // Save token to user
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();
    
    // Send reset email
    try {
      await sendPasswordResetEmail(email, resetToken);
      
      res.status(200).json({
        status: 'success',
        message: 'Password reset email sent'
      });
    } catch (error) {
      // If email fails, remove the reset token
      user.resetToken = undefined;
      user.resetTokenExpiry = undefined;
      await user.save();
      
      throw new AppError('Failed to send reset email', 500);
    }
  });
  
  // Reset password with token
  resetPassword = catchAsync(async (req: Request, res: Response) => {
    const { token, password } = req.body;
    
    // Find user with valid token
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });
    
    if (!user) {
      throw new AppError('Invalid or expired reset token', 400);
    }
    
    // Update password
    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();
    
    res.status(200).json({
      status: 'success',
      message: 'Password has been reset successfully'
    });
  });
}

export default new PasswordController(); 