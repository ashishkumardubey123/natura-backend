// sendingEmail.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAILSENDER,
    pass: process.env.EMAILPASSWORD,
  },
});

// Yahan 'emails' parameter add kiya gaya hai
export const sendAdminNotification = async (emails, subject, html) => {
  try {
    // Agar array hai to comma-separated string bana do
    const toEmails = Array.isArray(emails) ? emails.join(',') : emails;

    const mailOptions = {
      from: `"Natura Alerts" <${process.env.EMAILSENDER}>`,
      to: toEmails, // Ab saare admins ko jayega
      subject: subject,
      html: html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Admin Notification Sent to: ${toEmails}`);
  } catch (err) {
    console.error("Gmail Admin Notification Error:", err);
  }
};