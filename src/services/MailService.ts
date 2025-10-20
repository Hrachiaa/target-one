import nodemailer from 'nodemailer';
import {
    emailTemplateConfirmCode,
    emailTemplateResetCode,
} from '../utils/emailTemplate';

class MailService {
    private transporter;
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });
    }

    async sendResetCode(to: string, code: string) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Password Reset Code',
            text: '',
            html: emailTemplateResetCode(code),
        });
    }

    async sendConfirmCode(to: string, code: string) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Email Confirm Code',
            text: '',
            html: emailTemplateConfirmCode(code),
        });
    }
}

export default new MailService();
