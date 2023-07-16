import { Request, Response } from "express";
import { TokenValidations } from "../models/Token/Token.validations";
import { UserService } from "../services/User";
import catchAsync from "../utils/catch";
import { validate } from "../utils/validate";

const confirmEmail = catchAsync(async (req, res) => {
  const { body } = await validate(TokenValidations.confirmEmail, req);
  await UserService.confirmEmail(body.token);
  res.send({ message: "Email successfully confirmated" });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { body } = await validate(TokenValidations.resetPassword, req);
  res.send({ token: body.token });
});

export const TokenController = {
  confirmEmail,
  resetPassword,
};
