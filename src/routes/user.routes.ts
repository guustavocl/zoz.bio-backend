import express from "express";
import userController from "../controllers/user.controller";
import { authenticateToken } from "../middleware/auth";
import { rateLimiterDay, rateLimiterHour } from "../middleware/rateLimiter";

const router = express.Router();

router.get("/", rateLimiterHour(200), authenticateToken(), userController.getUser);
router.post(
  "/create",
  rateLimiterDay(10, false, "You cant create more accounts for today!"),
  userController.createUser
);
router.post("/send_confirm_email", rateLimiterDay(10), userController.sendConfirmEmail);
router.post("/send_reset_email", rateLimiterDay(10), userController.sendResetEmail);
router.post("/confirm_email", rateLimiterDay(3, true), userController.confirmEmail);
router.post("/reset_password", rateLimiterDay(5, true), userController.resetPassword);

export = router;
