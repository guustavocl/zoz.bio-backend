import { Request, Response, NextFunction } from "express";
import { config } from "../config";

export const rules = () => (req: Request, res: Response, next: NextFunction) => {
  if (config.production) {
    res.header("Access-Control-Allow-Origin", "https://zoz.bio");
  } else {
    res.header("Access-Control-Allow-Origin", "http://127.0.0.1:3000");
  }
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method == "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
  }

  next();
};
