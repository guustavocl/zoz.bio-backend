import { NextFunction, Request, Response } from "express";
import { generateAccessToken } from "../middleware/auth";
import User from "../models/User";
import bcrypt from "bcryptjs";

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (user) {
      if (!user.isEmailConfirmed) {
        return res.status(401).json({
          confirmation: true,
          message: "Your must confirm your email before sign in",
        });
      }
      //TODO latter includes banned user condition

      if (bcrypt.compareSync(password, user.password)) {
        const token = generateAccessToken(user);
        return res.status(200).json({
          message: "Login success",
          token,
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

export default {
  login,
};
