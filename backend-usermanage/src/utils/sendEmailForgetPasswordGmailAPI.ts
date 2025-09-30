import * as fs from 'fs';
import * as path from 'path';
import { google } from 'googleapis';

interface GoogleCredentials {
  installed: {
    client_id: string;
    client_secret: string;
    redirect_uris: string[];
  };
}

interface GoogleToken {
  access_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
  expiry_date?: number;
}
export async function sendResetPasswordWithGmailAPI(
  to: string,
  fullname: string,
  resetLink: string,
) {
  const credentialsPath = path.resolve(process.cwd(), 'credentials.json');
  const tokenPath = path.resolve(process.cwd(), 'token.json');

  const credentials: GoogleCredentials = JSON.parse(
    fs.readFileSync(credentialsPath, 'utf8'),
  ) as GoogleCredentials;
  const token = JSON.parse(fs.readFileSync(tokenPath, 'utf8')) as GoogleToken;

  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0],
  );

  oAuth2Client.setCredentials(token);
  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

  const logoPath = path.resolve(process.cwd(), 'src/images/Picture1.png');

  // 🔹 HTML Template ของ Reset Password
  const htmlTemplate = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
      <img src="cid:logo@ptec" alt="PTEC Logo" 
           style="max-width: 180px; height: auto; margin: 0 auto 20px; display: block;" />
      <h1 style="color: #333; margin: 0;">Password Reset Request</h1>
    </div>
    
    <div style="padding: 30px; background-color: #ffffff; border-radius: 8px;">
      <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
        สวัสดี ${fullname || 'ผู้ใช้งาน'},
      </p>
      
      <p style="font-size: 14px; color: #666; line-height: 1.6; margin-bottom: 25px;">
        ระบบได้รับคำขอให้รีเซ็ตรหัสผ่านของคุณ หากคุณไม่ได้เป็นผู้ร้องขอ กรุณาเพิกเฉยต่ออีเมลฉบับนี้ 
        และรหัสผ่านของคุณจะไม่มีการเปลี่ยนแปลง
      </p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" 
           style="background-color: #005BBB; color: white; padding: 12px 30px; 
                  text-decoration: none; border-radius: 5px; font-weight: bold; 
                  display: inline-block;">
          Reset Your Password
        </a>
      </div>
      
      <p style="font-size: 12px; color: #999; margin-top: 30px;">
        ลิงก์นี้จะหมดอายุใน 30 นาที เพื่อความปลอดภัย
      </p>
      
      <p style="font-size: 12px; color: #999;">
        หากปุ่มไม่สามารถใช้งานได้ ให้นำลิงก์นี้ไปวางในแถบ URL ของเบราว์เซอร์:<br>
        <span style="word-break: break-all;">${resetLink}</span>
      </p>
    </div>
    
    <div style="background-color: #f8f9fa; padding: 15px; text-align: center;">
      <p style="font-size: 12px; color: #666; margin: 0;">
        หากมีคำถามเพิ่มเติม กรุณาติดต่อทีมสนับสนุนของเรา
      </p>
    </div>

    <p style="font-size: 12px; color: #888; text-align: center; margin-top: 20px;">
      ขอแสดงความนับถือ<br/>PTEC Authentication Systems
    </p>
  </div>`;

  const subject = Buffer.from(
    'คำขอรีเซ็ตรหัสผ่าน (Password Reset Request)',
  ).toString('base64');

  // 🔹 MIME multipart (HTML + Image)
  const boundary = 'boundary_reset_' + Date.now();

  const messageParts = [
    `From: PTEC Authentication<${process.env.Email}>'`,
    `To: ${to}`,
    `Subject: =?UTF-8?B?${subject}?=`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/related; boundary=${boundary}`,
    '',
    `--${boundary}`,
    'Content-Type: text/html; charset="UTF-8"',
    '',
    htmlTemplate,
    '',
    `--${boundary}`,
    'Content-Type: image/png',
    'Content-Transfer-Encoding: base64',
    'Content-ID: <logo@ptec>',
    '',
    fs.readFileSync(logoPath).toString('base64'),
    '',
    `--${boundary}--`,
  ];

  const rawMessage = messageParts.join('\n');

  const encodedMessage = Buffer.from(rawMessage)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  // 🔹 ส่งเมลผ่าน Gmail API
  await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw: encodedMessage },
  });

  console.log(`✅ ส่ง Reset Password ไปยัง ${to} สำเร็จ`);
}
