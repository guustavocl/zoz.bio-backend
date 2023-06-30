// import nodemailer from "nodemailer";
import confirmEmailTemplate from "./mailTemplates";
import dotenv from "dotenv";
import logger from "./logger";
import SES from "aws-sdk/clients/ses";
dotenv.config();

const SESClient = new SES({
  region: "us-east-1",
});

export const sendConfirmationMail = async (mailTo: string, confirmUrl = "http://zoz.bio/") => {
  try {
    await SESClient.sendEmail({
      Source: "ZOZ.bio <noreply@zoz.bio>",
      Destination: {
        ToAddresses: [mailTo],
      },
      Message: {
        Subject: {
          Data: "Thanks for join us ✔",
        },
        Body: {
          Text: {
            Data: `Confirm Your Email Address
            Enter the following link to confirm your email address. ${confirmUrl} |
            If you didn't create an account with zoz.bio, you can safely delete this email.`,
          },
          Html: {
            Data: confirmEmailTemplate(confirmUrl),
          },
        },
      },
      ConfigurationSetName: "zozbio",
    }).promise();
  } catch (error) {
    logger.error(error, "Error on send confirmation email");
  }
};
