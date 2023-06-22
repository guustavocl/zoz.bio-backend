import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();

export const rules = () => (req: Request, res: Response, next: NextFunction) => {
  const cors = {
    origin: ["https://zoz.bio", "http://127.0.0.1:3000", "http://127.0.0.1:3001", "http://localhost:3000"],
    default: "https://zoz.bio",
  };

  // if (process.env.NODE_MODE === "production") {
  //   res.header("Access-Control-Allow-Origin", "https://zoz.bio");
  // } else {
  //   res.header("Access-Control-Allow-Origin", "http://127.0.0.1:3000");
  // }
  res.header(
    "Access-Control-Allow-Origin",
    cors.origin.includes(req.headers.origin || "") ? req.headers.origin : cors.default
  );
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method == "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
  }

  next();
};
