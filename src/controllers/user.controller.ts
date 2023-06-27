import { NextFunction, Request, Response } from "express";
import User, { UserProps } from "../models/User";
import logger from "../utils/logger";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import sendConfirmationMail from "../utils/mailSender";
import Token, { TokenProps } from "../models/Token";
import moment from "moment";
import Page from "../models/Page";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

const recaptchaSecret =
  process.env.NODE_MODE === "production" ? process.env.PROD_RECAPTCHA_SECRET : process.env.DEV_RECAPTCHA_SECRET;

const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userPayload } = res.locals;
    const user = await User.findOne({ _id: userPayload._id });
    if (user) {
      const pages = await Page.find({ userOwner: user }).select({ pagename: 1, uname: 1, pfpUrl: 1 });
      return res.status(200).json({
        user: user.toJSON(),
        pages: pages,
      });
    }
    res.status(404).json({ message: "user not found!" });
  } catch (error) {
    next(error);
  }
};

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { uname, email, password, cpassword, recaptcha } = req.body;

    if (password !== cpassword)
      return res.status(400).json({
        message: "Passwords doesn't match!",
      });

    if (!recaptcha)
      return res.status(400).json({
        message: "Hmmm, something is missing hehehehehehehehhehe",
      });

    // validate recapthca token
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${recaptcha}`
    );

    // ["error-codes"] includes "timeout-or-duplicate"
    if (!response?.data?.success)
      return res.status(400).json({
        message: "Maybe your token has expired, request a new recaptcha token and try again",
      });

    if (process.env.NODE_MODE === "production" && response?.data?.hostname !== "zoz.bio")
      return res.status(400).json({
        message: "Hmmm, your doin something nasty, go away!",
      });

    await new User({
      uname: uname,
      email: email.toLowerCase(),
      password: password,
    })
      .save()
      .then(async (user: UserProps) => {
        logger.info(user.toJSON(), "New User created");
        res.status(201).json({
          message: "Successfully registered, please confirm your email to sign in",
        });

        const confirmEmailToken = await createNewToken(user, "confirmEmail");
        if (confirmEmailToken)
          sendConfirmationMail(user.email, `http://zoz.bio/confirm?token=${confirmEmailToken.hash}`);
      })
      .catch(error => {
        next(error);
      });
  } catch (error) {
    next(error);
  }
};

const createNewToken = async (user: UserProps, type: string): Promise<TokenProps | null> => {
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hash = await bcrypt.hash(resetToken, bcrypt.genSaltSync(12));
  const token = await new Token({
    hash: hash,
    userOwner: user,
    type: type,
  }).save();
  return token;
};

const sendConfirmEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (user && !user.isEmailConfirmed) {
      let confirmEmailToken: TokenProps | null = await Token.findOne({
        userOwner: user,
        type: "confirmEmail",
      });
      if (!confirmEmailToken) {
        confirmEmailToken = await createNewToken(user, "confirmEmail");
        if (confirmEmailToken)
          sendConfirmationMail(user.email, `http://zoz.bio/confirm?token=${confirmEmailToken.hash}`);
      }
      if (confirmEmailToken && moment().diff(confirmEmailToken.createdAt, "minutes") > 1) {
        sendConfirmationMail(user.email, `http://zoz.bio/confirm?token=${confirmEmailToken.hash}`);
      }
    }

    res.status(200).json({
      message: "Confirmation email successfully sended, please check your inbox or in last case your spam folder.",
    });
  } catch (error) {
    next(error);
  }
};

const sendResetEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // const { email } = req.body;
  } catch (error) {
    next(error);
  }
};

const confirmEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body;
    const confirmEmailToken: TokenProps | null = await Token.findOne({
      hash: token,
      type: "confirmEmail",
    });

    if (confirmEmailToken && confirmEmailToken.hash === token) {
      const userOwner = confirmEmailToken.userOwner;
      await confirmEmailToken.deleteOne();
      await User.findOneAndUpdate({ _id: userOwner }, { isEmailConfirmed: true });
      return res.status(200).json({
        confirmated: true,
        message: "Email successfully confirmated",
      });
    }
    res.status(406).json({
      confirmated: false,
      message: "Confirmation failed, Invalid token",
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // const { uname, email, password } = req.body;
  } catch (error) {
    next(error);
  }
};

export default {
  getUser,
  createUser,
  sendConfirmEmail,
  sendResetEmail,
  confirmEmail,
  resetPassword,
};
