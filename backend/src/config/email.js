const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

const sendEmail = async (to, subject, html) => {
    try {
        await transporter.sendMail({
            from: '"Gà Rán Crispc" <no-reply@crispc.vn>',
            to,
            subject,
            html,
        });
        return true;
    } catch (error) {
        console.error("Lỗi gửi email:", error);
        return false;
    }
};

module.exports = sendEmail;
