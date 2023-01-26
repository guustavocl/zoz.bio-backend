import express from "express";
import linkController from "../controllers/link.controller";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

router.get("/folders", authenticateToken(), linkController.getFolders);
router.post("/create", authenticateToken(), linkController.createLink);
router.put("/update", authenticateToken(), linkController.updateLink);

export = router;
