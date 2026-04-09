// // utils/mailer.ts
// import nodemailer from 'nodemailer';

// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: Number(process.env.SMTP_PORT),
//   secure: false, // 587 ke liye false hi rahega
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// });

// export const sendMail = async (to: string | string[], subject: string, html: string) => { 
//    try {
//     const mailOptions = {
//       from: `"Natura Alerts" <${process.env.SMTP_USER}>`, // Brevo par verified email hi use karein
//       to: Array.isArray(to) ? to.join(',') : to,
//       subject: subject,
//       html: html,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log("Email sent via Brevo!");
//   } catch (error) {
//     console.error("Brevo SMTP Error:", error);
//   }
// };

const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// Ab ye function sirf 2 arguments lega
export const sendMail = async (subject: string, html: string) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Natura Alerts <onboarding@resend.dev>',
      // Yahan apni registered email fix rakhein
      to: 'hegscjab.mp.gov.in@gmail.com', 
      subject: subject,
      html: html,
    });

    if (error) {
      return console.error("Resend Error:", error);
    }
    console.log("Admin Notification Sent:", data?.id);
  } catch (err) {
    console.error("Mailer Error:", err);
  }
};