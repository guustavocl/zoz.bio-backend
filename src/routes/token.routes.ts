import { Router } from "express";
import { rateLimiterDay } from "../middleware/limiter.middleware";
import { TokenController } from "../controllers/token.controller";

export const TokenRoutes = Router();

TokenRoutes.post("/confirm_email", rateLimiterDay(3, true), TokenController.confirmEmail);
TokenRoutes.post("/reset_password", rateLimiterDay(5, true), TokenController.resetPassword);
