import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // e.g., smtp.mailersend.net
    port: Number(process.env.SMTP_PORT), // e.g., 587
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.MAILSEND_USERNAME, // Your MailerSend username
        pass: process.env.MAILSEND_PASSWORD // Your MailerSend password
    }
});

export const sendEmail = async (to: string, name: string) => {
    const mailOptions = {
        from: `${name}@${process.env.MAILSEND_DOMAIN}`, // sender address
        to, // list of receivers
        subject: 'Welcome!', // Subject line
        text: `Hello ${name}, welcome to our platform!`, // plain text body
        html: `<b>Hello ${name}, welcome to our platform!</b>` // html body
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error; // Rethrow or handle as needed
    }
}; 