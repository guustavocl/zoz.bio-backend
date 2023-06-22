import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User, { UserProps } from "../models/User";
dotenv.config();
const secret = process.env.TOKEN_SECRET || "";

export const authenticateToken = () => (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies["zoz_auth"];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, secret, {}, async (err: Error | null, payload: string | jwt.JwtPayload | undefined) => {
    if (err) return res.sendStatus(403);
    if (payload) {
      const userJwt = payload as UserProps;
      const user = await User.findOne({ _id: userJwt._id });
      if (!user || user.isBanned || user.isBlocked) return res.sendStatus(403);
      res.locals.userPayload = user;

      const token = generateAccessToken(user);
      const expireDate = new Date();
      expireDate.setDate(expireDate.getDate() + 1);
      res.cookie("zoz_auth", token, {
        secure: process.env.NODE_MODE === "production" ? false : false,
        httpOnly: true,
        expires: expireDate,
        sameSite: "strict",
        domain: process.env.NODE_MODE === "production" ? "zoz.bio" : "127.0.0.1",
      });
    }
    next();
  });
};

export const generateAccessToken = (user: UserProps) => {
  return jwt.sign({ _id: user._id, email: user.email, uname: user.uname }, secret, {
    expiresIn: "24h",
  });
};
