import express from "express";
import linkController from "../controllers/link.controller";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

router.get("/", authenticateToken(), linkController.getFolders);
router.post("/", authenticateToken(), linkController.createLink);
router.put("/", authenticateToken(), linkController.updateLink);
router.put("/delete", authenticateToken(), linkController.deleteLink);

export = router;
