import express from "express";
import userController from "../controllers/user.controller";
import { rateLimiterDay } from "../middleware/rateLimiter";

const router = express.Router();

router.get("/", userController.getUser);
router.post(
  "/create",
  rateLimiterDay(3, "You cant create more accounts for today!", true),
  userController.createUser
);
router.post(
  "/send_confirm_email",
  rateLimiterDay(10),
  userController.sendConfirmEmail
);
router.post(
  "/send_reset_email",
  rateLimiterDay(10),
  userController.sendResetEmail
);
router.post(
  "/confirm_email",
  rateLimiterDay(3, undefined, true),
  userController.confirmEmail
);
router.post(
  "/reset_password",
  rateLimiterDay(5, undefined, true),
  userController.resetPassword
);

export = router;
