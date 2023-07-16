import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { UserProps } from "../models/User/User.types";
import { UserService } from "../services/User";
import { ApiError } from "../utils/ApiError";
import catchAsync from "../utils/catch";
import { setCookie } from "../utils/jwt";

export const authenticate = (role = "user") =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies[config.authCookie];

    try {
      const payload = jwt.verify(token, config.jwtSecret);
      if (!payload) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");
      }
      let user = payload as UserProps | null;
      user = await UserService.findOne(user?._id);

      if (!user || user.isBanned || user.isBlocked) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");
      }
      if (role === "admin" && !user.isAdmin) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");
      }
      if (role === "mod" && !(user.isAdmin || user.isMod)) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");
      }

      // Save user payload to use their infos on controller
      res.locals.userPayload = user;

      // Refreshing token
      setCookie(user, res);

      next();
    } catch (err) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");
    }
  });
