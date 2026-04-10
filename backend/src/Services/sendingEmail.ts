import nodemailer from 'nodemailer';

// --- GMAIL SETUP ---
// Ek hi baar transporter banayenge taaki fast kaam kare
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAILSENDER,
    pass: process.env.EMAILPASSWORD,
  },
});

// 1. Ye function admin ko (ya kisi fixed email ko) alerts bhejne ke liye hai
export const sendAdminNotification = async (subject: string, html: string) => {
  try {
    const mailOptions = {
      from: `"Natura Alerts" <${process.env.EMAILSENDER}>`,
      // Yahan wo email daalein jispar saare form submissions receive karne hain
      to: 'hegscjab.mp.gov.in@gmail.com', 
      subject: subject,
      html: html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Admin Notification Sent via Gmail! Subject: ${subject}`);
  } catch (err) {
    console.error("Gmail Admin Notification Error:", err);
  }
};

// 2. Ye aapka OTP bhejne wala function hai
export const sendOtpEmailPin = async (email: string, otp: string | number) => {
  try {
    const mailOptions = {
      from: `"Natura Alerts" <${process.env.EMAILSENDER}>`,
      to: email,
      subject: "Your OTP for Changing PIN",
      text: `Your OTP for changing your PIN is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP sent successfully to ${email}`);
  } catch (error) {
    console.error("OTP Email Error:", error);
  }
};