"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendAdminNotification = void 0;
// sendingEmail.js
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAILSENDER,
        pass: process.env.EMAILPASSWORD,
    },
});
// Yahan 'emails' parameter add kiya gaya hai
const sendAdminNotification = async (emails, subject, html) => {
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
    }
    catch (err) {
        console.error("Gmail Admin Notification Error:", err);
    }
};
exports.sendAdminNotification = sendAdminNotification;
