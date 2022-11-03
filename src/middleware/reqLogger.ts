import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

const getDurationInMilliseconds = (start: any) => {
  const NS_PER_SEC = 1e9;
  const NS_TO_MS = 1e6;
  const diff = process.hrtime(start);

  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS / 1000;
};

export const reqLogger =
  () => (req: Request, res: Response, next: NextFunction) => {
    const start = process.hrtime();
    /* RESPONSE LOGGER */
    res.on("finish", () => {
      logger.info(
        `# [${req.method} - RES ${res.statusCode}] - Path: [${
          req.originalUrl
        }] - IP: [${
          req.socket.remoteAddress
        }] - Duration: [${getDurationInMilliseconds(start)}s]`
      );
    });

    next();
  };
