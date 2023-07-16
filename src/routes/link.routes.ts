import { Router } from "express";
import { LinkController } from "../controllers/link.controller";
import { authenticate } from "../middleware/auth.middleware";

export const LinkRoutes = Router();

LinkRoutes.route("/")
  .get(authenticate("admin"), LinkController.getOne)
  .post(authenticate(), LinkController.create)
  .put(authenticate(), LinkController.update);

LinkRoutes.get("/folders", authenticate(), LinkController.getFolders);

LinkRoutes.put("/delete", authenticate(), LinkController.remove);
