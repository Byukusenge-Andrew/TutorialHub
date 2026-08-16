import nodemailer from 'nodemailer';

const port = Number(process.env.SMTP_PORT) || 465;

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.resend.com',
    port,
    secure: port === 465,
    auth: {
        user: process.env.SMTP_USER || 'resend',
        pass: process.env.RESEND_API_KEY || process.env.MAILSEND_PASSWORD || ''
    }
});

export const sendEmail = async (to: string, name: string) => {
    const fromAddress = process.env.EMAIL_FROM || 'onboarding@resend.dev';
    const mailOptions = {
        from: `"TutorialHub" <${fromAddress}>`,
        to,
        subject: 'Welcome!',
        text: `Hello ${name}, welcome to our platform!`,
        html: `<b>Hello ${name}, welcome to our platform!</b>`
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw error;
    }
}; 