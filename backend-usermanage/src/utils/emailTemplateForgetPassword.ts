import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import * as path from 'path';

export function getResetPasswordMailOptions(
  to: string,
  fullname: string,
  resetLink: string,
): SMTPTransport.MailOptions {
  return {
    from: process.env.Email,
    to: to,
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
          <img src="cid:logo@ptec" alt="PTEC Logo" style="width: 300px; height: auto; margin: 0 auto 20px; display: block;" />
          <h1 style="color: #333; margin: 0;">Password Reset Request</h1>
        </div>
        
        <div style="padding: 30px; background-color: white;">
          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
            สวัสดี ${fullname || 'User'},
          </p>
          
          <p style="font-size: 14px; color: #666; line-height: 1.6; margin-bottom: 25px;">
            "ระบบได้รับคำขอให้รีเซ็ตรหัสผ่านของคุณ หากคุณไม่ได้เป็นผู้ร้องขอ กรุณาเพิกเฉยอีเมลฉบับนี้ และรหัสผ่านของคุณจะไม่มีการเปลี่ยนแปลง"
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="background-color: #007bff; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 5px; font-weight: bold; 
                      display: inline-block;">
              Reset Your Password
            </a>
          </div>
          
          <p style="font-size: 12px; color: #999; margin-top: 30px;">
            ลิงก์นี้จะหมดอายุใน 30 นาที เพื่อความปลอดภัย
          </p>
          
          <p style="font-size: 12px; color: #999;">
            ถ้าปุ่มไม่สามารถใช้งานได้ ให้นำลิงก์นี้ไปวางใน แถบ URL ของเบราว์เซอร์ :<br>
            <span style="word-break: break-all;">${resetLink}</span>
          </p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 15px; text-align: center;">
          <p style="font-size: 12px; color: #666; margin: 0;">
            If you have any questions, please contact our support team.
          </p>
        </div>
        <p style="font-size: 12px; color: #888; text-align: center; margin-top: 20px;">
          ขอแสดงความนับถือ<br/>PTEC Authentication Systems
        </p>
      </div>
    `,
    attachments: [
      {
        filename: 'Picture1.png',
        path: path.resolve(process.cwd(), 'src/images/Picture1.png'),
        cid: 'logo@ptec',
      },
    ],
  };
}
