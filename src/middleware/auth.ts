import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { IUser } from "../models/User";
dotenv.config();
const secret = process.env.TOKEN_SECRET || "";

export const authenticateToken =
  () => (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    // const userId = req.headers["userid"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, secret, async (err, user) => {
      if (err) return res.sendStatus(403);
      // user.id = userId;
      // req.user = user;
      next();
    });

    next();
  };

export const generateAccessToken = (user: IUser) => {
  return jwt.sign({ email: user.email, uname: user.uname }, secret, {
    expiresIn: "48h",
  });
};
