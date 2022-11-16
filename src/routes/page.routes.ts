import express from "express";
import pageController from "../controllers/page.controller";
import { authenticateToken } from "../middleware/auth";
import { rateLimiterHour } from "../middleware/rateLimiter";

const router = express.Router();

router.get("/", pageController.getPage);
router.post(
  "/create",
  rateLimiterHour(30, "You cant create more pages for now", true),
  authenticateToken(),
  pageController.createPage
);

export = router;
