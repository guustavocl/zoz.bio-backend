import express, { Router } from "express";
import { UserRoutes } from "./routes/user.routes";
import { AuthRoutes } from "./routes/auth.routes";
import { PageRoutes } from "./routes/page.routes";
import { LinkRoutes } from "./routes/link.routes";
import { TokenRoutes } from "./routes/token.routes";

const router = Router();

router.use("/user", UserRoutes);
router.use("/auth", AuthRoutes);
router.use("/page", PageRoutes);
router.use("/link", LinkRoutes);
router.use("/token", TokenRoutes);
router.use("/images", express.static("images"));

/* UPTIME CHECK */
router.get("/ping", (req, res) => res.status(200).json({ message: "pong" }));

/*  NOT FOUND */
router.get("*", (req, res) => res.status(404).json({ message: "Not Found~" }));

export { router };
