// import nodemailer from "nodemailer";
import axios from "axios";
import { config } from "../config";
import { CONFIRMATION_MAIL_TEXT } from "./constants";
import logger from "./logger";
import confirmEmailTemplate from "../templates/confirmEmail";

export const sendConfirmationMail = async (mailTo: string, confirmUrl = "http://zoz.bio/") => {
  try {
    const textMsg = CONFIRMATION_MAIL_TEXT(confirmUrl);
    const html = confirmEmailTemplate(confirmUrl);
    await axios.post(
      config.mailSenderUrl,
      {
        from: "noreply@zoz.bio",
        fromName: "ZOZ.bio",
        to: mailTo,
        subject: "Thanks for join us ✔",
        text: textMsg,
        html: html,
      },
      {
        headers: {
          Authorization: config.mailSenderToken,
        },
      }
    );
  } catch (error) {
    console.log(error);
    logger.error("Error on send confirmation email");
  }
};
