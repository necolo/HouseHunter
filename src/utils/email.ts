import nodemailer from 'nodemailer';
import { Post } from '../types';

export interface EmailConfig {
  receivers: string[];
  sender: string;
  port: number;
  password: string;
  host: string;
}

export async function sendEmail(config: EmailConfig, subject: string, html: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: config.host,
    port: config.port,
    auth: {
      user: config.sender,
      pass: config.password,
    },

    secure: true,
    secureConnection: false, // TLS requires secureConnection to be false
    tls: { ciphers:'SSLv3', rejectUnAuthorized: true },
  });
  await transporter.verify();
  const message = {
    from: config.sender,
    to: config.receivers.join(', '),
    subject,
    html,
  };

  transporter.sendMail(message, (err, info) => {
    if (err) {
      throw new Error(err);
    }
    console.log(info);
  })
};

export function mailHtml(posts: Post[]) {
  return `
<html>
  <head></head>
  <body>
    ${posts.map(post => `<a href="${post.href}">${post.title}</a>`).join('\n')}
  </body>
</html>
  `;
}