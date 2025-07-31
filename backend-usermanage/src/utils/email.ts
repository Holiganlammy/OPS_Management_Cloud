import { createTransport } from 'nodemailer';
import type { Transporter } from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import { getOtpMailOptions } from './emailTemplate';
import { User } from 'src/PTEC_USERIGHT/domain/model/ptec_useright.entity';

export async function sendOtpEmail(
  to: string,
  user: User,
  otp: string,
): Promise<void> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const transporter: Transporter<SMTPTransport.SentMessageInfo> =
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      createTransport({
        service: 'gmail',
        auth: {
          user: process.env.Email,
          pass: process.env.Secret_Password,
        },
      });
    const emailTemplate = getOtpMailOptions(to, user, otp);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const result = await transporter.sendMail(emailTemplate);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    console.log('Email sent successfully:', result.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
