import { NextFunction, Request, Response } from "express";
import User, { IUser } from "../models/User";
import logger from "../utils/logger";
import bcrypt from "bcryptjs";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;

    const salt = bcrypt.genSaltSync(12);
    const encryptedPassword = bcrypt.hashSync(password ? password : "", salt);

    await new User({
      uname: name,
      email: email.toLowerCase(),
      password: password ? encryptedPassword : null,
    })
      .save()
      .then((user: IUser) => {
        logger.info(user.toJSON(), "user created");
        res.status(201).json({ message: "User successfully created" });
      })
      .catch((error: any) => {
        next(error);
      });
  } catch (error) {
    next(error);
  }
};

export default {
  createUser,
};
