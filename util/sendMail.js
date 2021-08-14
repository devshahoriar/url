'use strict';
import nodemailer from 'nodemailer';

async function mailSend(recevar,textSub,textBody) {
  const pass = process.env.EMAIL_PASS;
  let transporter = nodemailer.createTransport({
    
    service: 'Gmail',
    host: 'smtp.gmail.com',
    
    auth: {
      user: 'sa8326637@gmail.com',
      pass: pass, 
    },
  });

  let info = await transporter.sendMail({
    from: 'sa8326637@gmail.com',
    to: recevar,
    subject: textSub,
    text: textBody,
    //html: '<b>html gose there</b>',
  });

  // console.log('Message sent: %s', info.messageId);

}

export default mailSend;
