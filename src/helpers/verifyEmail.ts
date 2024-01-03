import nodemailer from 'nodemailer';
import { GmailInfo } from '../@types/UserInfo';

async function sendMail(data: GmailInfo) {

    const transport = nodemailer.createTransport({
        host: process.env.NODEMAILER_HOST,
        port: Number(process.env.NODEMAILER_PORT),
        secure: false,
        auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASS
        }
    });

    const {name, email, token} = data;

    const info = await transport.sendMail({
        from: 'Task Manager - <taskManage@gmail.com>',
        to: email,
        subject: 'Verify your account on Task Manager',
        text: 'Verify your account on Task Manager',
        html: `
            <p>Hi ${name}, verify your account on Task Manager</p>
            <p>Everything is ready to start using Task Manager, you just have to click in this link to verify your account: <a href="${process.env.FRONTEND_URL}/users/auth/confirm/${token}">Verify your account</a></p>

            <p>If you didn't create this account, you can ignore this email</p>
        `
    });
}

export default sendMail;