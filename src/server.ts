import bodyParser from "body-parser";
import timeout from "connect-timeout";
import cookies from "cookie-parser";
import express from "express";
import http from "http";
import mongoose from "mongoose";
import { config } from "./config";
import { errorHandler } from "./middleware/errors.middleware";
import { rateLimiter } from "./middleware/limiter.middleware";
import { requestLogger } from "./middleware/logger.middleware";
import { rules } from "./middleware/rules.middleware";
import { router } from "./routes";
import logger from "./utils/logger";

const app = express();

mongoose
  .connect(config.mongoose.url, { retryWrites: true })
  .then(() => {
    logger.info("Mongoose successfully connected!");
    runServer();
  })
  .catch(error => {
    logger.error(error, "Mongoose error");
  });

const runServer = () => {
  /* CONFIGS */
  app.use(timeout(config.timeout));
  app.use(bodyParser.json({ limit: config.requestSizeLimit }));
  app.use(bodyParser.urlencoded({ limit: config.requestSizeLimit, extended: true }));

  /* LOGGER */
  app.use(requestLogger());

  /* RULES & COOKIES */
  app.use(rules());
  app.use(cookies());

  /* RATE LIMITER */
  app.use(rateLimiter());

  /*  ROUTES DECLARATION */
  app.use(router);

  /* ERROR HANDLING */
  app.use(errorHandler());

  http.createServer(app).listen(config.port, () => logger.info(`Server running on port ${config.port}`));
};
