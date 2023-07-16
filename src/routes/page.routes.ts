import { Router } from "express";
import { PageController } from "../controllers/page.controller";
import { authenticate } from "../middleware/auth.middleware";
import { rateLimiterHour } from "../middleware/limiter.middleware";
import { uploadAvatar, uploadBackground } from "../middleware/upload.middleware";

export const PageRoutes = Router();

PageRoutes.route("/")
  .get(PageController.getByPagename)
  .post(rateLimiterHour(30, false, "You cant create more pages for now"), authenticate(), PageController.create);

PageRoutes.get("/edit", authenticate(), PageController.getPageToEdit);

PageRoutes.get("/check_pagename", authenticate(), PageController.checkPagename);
PageRoutes.post("/save_info", authenticate(), PageController.updatePageInfo);
PageRoutes.post("/save_badges", authenticate(), PageController.updatePageBadges);
PageRoutes.post("/save_social_media", authenticate(), PageController.updatePageSocialMedia);

PageRoutes.post("/upload_avatar", authenticate(), uploadAvatar(), PageController.updatePageAvatar);
PageRoutes.post("/upload_background", authenticate(), uploadBackground(), PageController.updatePageBackground);

PageRoutes.post("/update_colors", authenticate(), PageController.updatePageColors);
