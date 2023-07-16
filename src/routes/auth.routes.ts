import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { rateLimiterHour } from "../middleware/limiter.middleware";

export const AuthRoutes = Router();

AuthRoutes.post(
  "/login",
  rateLimiterHour(10, false, "You’ve reached the maximum logon attempts"),
  AuthController.login
);
AuthRoutes.post("/logout", AuthController.logout);
