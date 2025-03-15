import nodemailer from 'nodemailer';

export const emailTransporter = nodemailer.createTransport({
  host: 'smtp.mailersend.net',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'MS_qnk3Sb@trial-7dnvo4d5w9xl5r86.mlsender.net',
    pass: 'mssp.OKIp23S.pr9084z1x9xgw63d.JxAy02p'
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