import { NextFunction, Request, Response } from "express";
import { generateAccessToken } from "../middleware/auth";
import User from "../models/User";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const loginIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress;
    const user = await User.findOneAndUpdate(
      { email: email },
      { $inc: { loginCount: 1 }, lastLoginIP: loginIp, lastLoginDate: new Date() }
    );

    if (user) {
      if (user.isBanned || user.isBlocked) {
        return res.status(403).json({
          message: "Your are banned or blocked, sorry",
        });
      }

      if (bcrypt.compareSync(password, user.password)) {
        const token = generateAccessToken(user);
        const expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 1);
        console.log(process.env.NODE_MODE);
        res.cookie("zoz_auth", token, {
          secure: process.env.NODE_MODE === "production" ? true : false,
          httpOnly: false,
          expires: expireDate,
          // sameSite: process.env.NODE_MODE === "production" ? "none" : "strict",
          sameSite: "lax",
        });

        return res.status(200).json({
          message: "Login success",
          user: user.toJSON(),
        });
      }
    }

    res.status(401).json({
      message: "The email or password you entered is incorrect.",
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.cookie("zoz_auth", "", {
      // secure: process.env.NODE_MODE === "production" ? true : false,
      secure: false,
      httpOnly: true,
      expires: new Date(1),
    });
    return res.status(200).json({
      message: "Logout successfull.",
    });
  } catch (error) {
    next(error);
  }
};

export default {
  login,
  logout,
};
