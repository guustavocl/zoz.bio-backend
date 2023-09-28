import { Request, Response } from "express";
import catchAsync from "../utils/catch";
import { removeCookie, setCookie } from "../utils/jwt";
import { validate } from "../utils/validate";
import { AuthService } from "../services/Auth";
import { AuthValidations } from "../models/Auth/Auth.validations";

const login = catchAsync(async (req: Request, res: Response) => {
  const { body } = await validate(AuthValidations.login, req);
  const loginIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress;
  const user = await AuthService.login(body.email, body.password, loginIp);
  setCookie(user, res);
  res.send({ user });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  removeCookie(res);
  res.send({ message: "Logout successfull" });
});

export const AuthController = {
  login,
  logout,
};
