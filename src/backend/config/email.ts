import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const host = process.env.SMTP_HOST || 'smtp.resend.com';
const port = Number(process.env.SMTP_PORT) || 465;

export const emailTransporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465,
  auth: {
    user: process.env.SMTP_USER || 'resend',
    pass: process.env.RESEND_API_KEY || process.env.MAILSEND_PASSWORD || ''
  }
});

// Verify connection configuration
emailTransporter.verify(function (error, success) {
  if (error) {
    console.log('Email configuration error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
}); 