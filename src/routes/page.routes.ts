import express from "express";
import pageController from "../controllers/page.controller";
import { authenticateToken } from "../middleware/auth";
import { rateLimiterHour } from "../middleware/rateLimiter";
import { uploadAvatar, uploadBackground } from "../middleware/uploadFile";

const router = express.Router();

router.get("/", pageController.getPage);
router.post(
  "/create",
  rateLimiterHour(30, "You cant create more pages for now", true),
  authenticateToken(),
  pageController.createPage
);
router.get(
  "/check_pagename",
  authenticateToken(),
  pageController.checkPagename
);
router.post("/save_info", authenticateToken(), pageController.savePageInfo);

router.post(
  "/upload_avatar",
  authenticateToken(),
  uploadAvatar(),
  pageController.uploadAvatar
);
router.post(
  "/upload_background",
  authenticateToken(),
  uploadBackground(),
  pageController.uploadBackground
);

router.post("/update_colors", authenticateToken(), pageController.updateColors);

export = router;
