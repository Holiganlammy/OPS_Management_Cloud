import { createTransport } from 'nodemailer';
import type { Transporter } from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import { getResetPasswordMailOptions } from './emailTemplateForgetPassword';

export async function sendResetPasswordEmail(
  to: string,
  fullname: string,
  resetLink: string,
): Promise<void> {
  try {
    const transporter: Transporter<SMTPTransport.SentMessageInfo> =
      createTransport({
        service: 'gmail',
        auth: {
          user: process.env.Email,
          pass: process.env.Secret_Password,
        },
      });

    const emailTemplate = getResetPasswordMailOptions(to, fullname, resetLink);

    const result = await transporter.sendMail(emailTemplate);

    console.log('Reset password email sent successfully:', result.messageId);
  } catch (error) {
    console.error('Error sending reset password email:', error);
    throw error;
  }
}
