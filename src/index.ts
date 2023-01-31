import express from "express";
import http from "http";
import cors from "cors";
import timeout from "connect-timeout";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { config } from "./config/config";
import { errorHandler } from "./middleware/errorHandler";
import { reqLogger } from "./middleware/reqLogger";
import { rules } from "./middleware/rules";
import logger from "./utils/logger";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import pageRoutes from "./routes/page.routes";
import linkRoutes from "./routes/link.routes";
import { rateLimiter } from "./middleware/rateLimiter";

const router = express();

mongoose
  .connect(config.mongo.url, { retryWrites: true })
  .then(() => {
    logger.info("Mongoose successfully connected!");
    runServer();
  })
  .catch(error => {
    logger.error(error, "Mongoose error");
  });

const runServer = () => {
  /* CONFIGS */
  router.use(timeout("30s"));
  router.use(bodyParser.json({ limit: "10mb" }));
  router.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
  router.use(cors());

  /* LOGGER */
  router.use(reqLogger());

  /* RULES */
  router.use(rules());

  /* RATE LIMITER */
  router.use(rateLimiter());

  /*  ROUTES */
  router.use("/user", userRoutes);
  router.use("/auth", authRoutes);
  router.use("/page", pageRoutes);
  router.use("/link", linkRoutes);
  router.use("/images", express.static("images"));

  /* CHECK */
  router.get("/ping", (req, res) => res.status(200).json({ message: "pong" }));

  /* ERROR HANDLING */
  router.use(errorHandler());

  http
    .createServer(router)
    .listen(config.server.port, () => logger.info(`Server running on port ${config.server.port}`));
};
