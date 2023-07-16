import jwt from "jsonwebtoken";
import { config } from "../config";
import { UserProps } from "../models/User/User.types";
import { Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export const setCookie = (user: UserProps, res: Response) => {
  const token = createToken(user);

  const expireDate = new Date();
  expireDate.setDate(expireDate.getDate() + 1);

  res.cookie(config.authCookie, token, {
    domain: config.production ? "zoz.bio" : "127.0.0.1",
    secure: config.production ? true : false,
    expires: expireDate,
    httpOnly: true,
    sameSite: "strict",
  });
};

export const removeCookie = (res: Response) => {
  res.cookie(config.authCookie, "", {
    domain: config.production ? "zoz.bio" : "127.0.0.1",
    secure: config.production ? true : false,
    expires: new Date(1),
    httpOnly: true,
    sameSite: "strict",
  });
};

export const createToken = (user: UserProps) => {
  return jwt.sign({ _id: user._id }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};

export const createHash = async () => {
  const random = crypto.randomBytes(32).toString("hex");
  const hash = await bcrypt.hash(random, bcrypt.genSaltSync(12));
  return hash;
};
