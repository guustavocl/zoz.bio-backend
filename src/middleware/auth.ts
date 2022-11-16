import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User, { IUser } from "../models/User";
dotenv.config();
const secret = process.env.TOKEN_SECRET || "";

export const authenticateToken =
  () => (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, secret, async (err, payload) => {
      if (err) return res.sendStatus(403);
      if (payload) {
        const userJwt = payload as IUser;
        const user = await User.findOne({ _id: userJwt._id });
        if (!user || user.isBanned || user.isBlocked)
          return res.sendStatus(403);
        res.locals.userPayload = user;
      }
      next();
    });
  };

export const generateAccessToken = (user: IUser) => {
  return jwt.sign(
    { _id: user._id, email: user.email, uname: user.uname },
    secret,
    {
      expiresIn: "48h",
    }
  );
};
