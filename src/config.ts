import dotenv from "dotenv";
dotenv.config();
const production = process.env.NODE_ENV === "production";

export const config = {
  env: process.env.NODE_ENV,
  production: production,
  port: production ? 3000 : 3100,
  apiUrl: production ? "https://api.zoz.bio/" : "http://127.0.0.1:3100/",
  timeout: "30s",
  requestSizeLimit: "10mb",
  mongoose: {
    url: (production ? process.env.MONGO_PRODUCTION_URL : process.env.MONGO_DEVELOPMENT_URL) || "",
    options: {
      retryWrites: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwtSecret: process.env.JWT_SECRET || "",
  jwtExpiresIn: "24h",
  authCookie: "zoz_auth",
  recaptchaSecret: production ? process.env.RECAPTCHA_PRODUCTION_SECRET : process.env.RECAPTCHA_DEVELOPMENT_SECRET,
  mailSenderToken: process.env.MAIL_SENDER_TOKEN,
  mailSenderUrl: production ? "https://sender.gus.sh/mail" : "http://127.0.0.1:3333/mail",
};
