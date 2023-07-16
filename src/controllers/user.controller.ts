import { Request, Response } from "express";
import httpStatus from "http-status";
import { UserValidations } from "../models/User/User.validations";
import { MailService } from "../services/Mail";
import { PageService } from "../services/Page";
import { UserService } from "../services/User";
import { ApiError } from "../utils/ApiError";
import catchAsync from "../utils/catch";
import { validate } from "../utils/validate";

const getOne = catchAsync(async (req: Request, res: Response) => {
  const { query } = await validate(UserValidations.getOne, req);
  const user = await UserService.findOne(query.userId);

  if (user) return res.send({ user: user.toJSON() });
  throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
});

const getLogged = catchAsync(async (req: Request, res: Response) => {
  const { userPayload } = res.locals;
  const user = await UserService.findOne(userPayload?._id);

  if (user) {
    const pages = await PageService.findAllUserPages(user._id);
    return res.send({ user: user.toJSON(), pages });
  }
  throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
});

const create = catchAsync(async (req, res) => {
  const { body } = await validate(UserValidations.create, req);
  const user = await UserService.create(body, body.recaptcha);
  res
    .status(httpStatus.CREATED)
    .send({ message: "Successfully registered, please confirm your email to sign in", email: user?.email });
  MailService.sendConfirmation(user);
});

const sendConfirmationEmail = catchAsync(async (req, res) => {
  const { userPayload } = res.locals;
  const user = await UserService.findOne(userPayload?._id);
  if (user && !user.isEmailConfirmed) {
    await MailService.sendConfirmation(user);
  }
  res.send({
    message: "Confirmation email successfully sended, please check your inbox or your spam folder.",
  });
});

const sendResetEmail = catchAsync(async (req: Request, res: Response) => {
  // const { body } = await validate(AuthValidations.login, req);
  res.send({});
});

export const UserController = {
  getOne,
  getLogged,
  create,
  sendConfirmationEmail,
  sendResetEmail,
};
