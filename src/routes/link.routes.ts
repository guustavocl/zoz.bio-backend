import express from "express";
import linkController from "../controllers/link.controller";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

router.post("/create", authenticateToken(), linkController.createLink);
router.put("/update", authenticateToken(), linkController.updateLink);

export = router;
