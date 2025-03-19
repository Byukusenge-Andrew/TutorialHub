import nodemailer from 'nodemailer';
import logger from './logger';
import { emailTransporter } from '../config/email';

// Create transporter with MailerSend credentials
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAILSEND_USERNAME,
    pass: process.env.MAILSEND_PASSWORD,
  },
});

// Function to send welcome email
export const sendWelcomeEmail = async (to: string, name: string) => {
  try {
    await emailTransporter.sendMail({
      from: 'MS_qnk3Sb@trial-7dnvo4d5w9xl5r86.mlsender.net',
      to,
      subject: 'Welcome to TutorialHub!',
      html: `
        <h1>Welcome ${name}!</h1>
        <p>Thank you for joining TutorialHub. We're excited to have you on board!</p>
      `
    });
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};

// Function to send password reset email
export const sendPasswordResetEmail = async (email: string, resetToken: string): Promise<void> => {
  try {
    const resetUrl = `${process.env.VITE_API_URL}/reset-password/${resetToken}`;
    
    const mailOptions = {
      from: `"Code Learning Platform" <${process.env.MAILSEND_USERNAME}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>You requested a password reset. Please click the link below to reset your password:</p>
          <p><a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">Reset Password</a></p>
          <p>If you didn't request this, please ignore this email.</p>
          <p>The link will expire in 1 hour.</p>
          <p>The Code Learning Platform Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Password reset email sent to ${email}`);
  } catch (error) {
    logger.error('Error sending password reset email:', error);
    throw error;
  }
};

// Function to send notification email
export const sendNotificationEmail = async (email: string, subject: string, message: string): Promise<void> => {
  try {
    const mailOptions = {
      from: `"Code Learning Platform" <${process.env.MAILSEND_USERNAME}>`,
      to: email,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>${subject}</h2>
          <p>${message}</p>
          <p>The Code Learning Platform Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Notification email sent to ${email}`);
  } catch (error) {
    logger.error('Error sending notification email:', error);
    throw error;
  }
};

export const sendChallengeCompletionEmail = async (email: string, challengeName: string) => {
  const subject = 'Challenge Completed!';
  const content = `
    <h1>Congratulations!</h1>
    <p>You've successfully completed the challenge: ${challengeName}</p>
    <p>Keep up the great work!</p>
  `;

  try {
    const mailOptions = {
      from: `"Code Learning Platform" <${process.env.MAILSEND_USERNAME}>`,
      to: email,
      subject,
      html: content
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Challenge completion email sent to ${email}`);
    return true;
  } catch (error) {
    logger.error('Error sending challenge completion email:', error);
    throw error;
  }
};

// Function to send verification email
export const sendVerificationEmail = async (to: string, name: string, token: string) => {
  // const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  //if dev
  // const frontendUrl = 'http://localhost:5173';
  //if prod
  const frontendUrl = 'https://tutorial-hub-01.vercel.app';
  const verificationUrl = `${frontendUrl}/verify-email/${token}`;
  
  try {
    await emailTransporter.sendMail({
      from: 'MS_qnk3Sb@trial-7dnvo4d5w9xl5r86.mlsender.net',
      to,
      subject: 'Verify your email address',
      html: `
        <h1>Hi ${name},</h1>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
        <p>This link will expire in 24 hours.</p>
      `
    });
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
}; 