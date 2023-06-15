import dotenv from "dotenv";
dotenv.config();

export const config = {
  mongoUrl: `${process.env.NODE_MODE === "production" ? process.env.PROD_MONGO_URL : process.env.DEV_MONGO_URL}`,
  serverPort: process.env.NODE_MODE === "production" ? 3000 : 3100,
  apiUrl: process.env.NODE_MODE === "production" ? "https://api.zoz.bio/" : "http://127.0.0.1:3100/",
};
