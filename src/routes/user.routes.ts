import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authenticate } from "../middleware/auth.middleware";
import { rateLimiterDay, rateLimiterHour } from "../middleware/limiter.middleware";

export const UserRoutes = Router();

UserRoutes.route("/")
  .get(rateLimiterHour(200), authenticate("admin"), UserController.getOne)
  .post(rateLimiterDay(10, false, "You cant create more accounts for today!"), UserController.create);

UserRoutes.get("/logged", rateLimiterHour(200), authenticate(), UserController.getLogged);

UserRoutes.post("/send_confirm_email", rateLimiterDay(10), UserController.sendConfirmationEmail);
UserRoutes.post("/send_reset_email", rateLimiterDay(10), UserController.sendResetEmail);
