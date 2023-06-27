import express from "express";
import authController from "../controllers/auth.controller";
import { rateLimiterHour } from "../middleware/rateLimiter";

const router = express.Router();

router.post("/login", rateLimiterHour(10, false, "You’ve reached the maximum logon attempts"), authController.login);
router.post("/logout", authController.logout);

export = router;
