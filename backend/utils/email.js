const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

exports.emailVerification = async (email, otp) => {
    try {
      await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Account registration verification code",
      text: `Your verification code is: ${otp}`,
    });
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Unable to send verification email");
    }
}

exports.sendBoardInviteEmail = async (email, boardName, boardDescription) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Invitation to join board: ${boardName}`,
      text: `You have been invited to join the board "${boardName}".\nDescription: ${boardDescription}`,
    });
  } catch (error) {
    console.error("Error sending invite email:", error);
    throw new Error("Unable to send invite email");
  }
};