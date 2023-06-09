// import nodemailer from "nodemailer";
import nodemailer from "nodemailer";
import confirmEmailTemplate from "./mailTemplates";
import dotenv from "dotenv";
dotenv.config();

const noReplyMail = "noreply@zoz.bio";
const noReplyPwd = process.env.MAIL_NOREPLY_PWD;

const sendConfirmationMail = async (mailTo: string, confirmUrl = "http://zoz.bio/") => {
  const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
    auth: {
      user: noReplyMail,
      pass: noReplyPwd,
    },
  });

  await transporter.sendMail({
    from: '"zoz.bio" <noreply@zoz.bio>',
    to: mailTo,
    subject: "Thanks for join us ✔",
    text: `Confirm Your Email Address
            Enter the following link to confirm your email address. ${confirmUrl} |
            If you didn't create an account with zoz.bio, you can safely delete this email.`,
    html: confirmEmailTemplate(confirmUrl), // html body
  });
};

export default sendConfirmationMail;
