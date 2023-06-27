import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

type ErrorProps = {
  name: string;
  message: string;
  errors: {
    message: string;
    kind: string;
    path: string;
    value: string;
    reason: string;
  };
};

export const errorHandler = () => (error: unknown, req: Request, res: Response, next: NextFunction) => {
  try {
    if (error) {
      if (typeof error === "string") {
        return res.status(400).json({ message: error });
      }
      if (typeof error === "object") {
        const objectError = error as ErrorProps;

        // Mongoose validation will catch here
        if (objectError.name === "ValidationError") {
          const message = objectError.message.split(":").reverse();
          return res.status(400).json({ message: message[0] });
        }

        if (objectError.name === "UnauthorizedError") {
          return res.status(401).json({ message: "Unauthorized. Session expired or invalid" });
        }

        return res.status(400).json({ message: objectError.message });
      }
    }
    logger.error("Error handler", new Error("Error not and string or object please check this"));
    if (res?.status) return res?.status(500).json({ message: "Something went wrong D:" });
    next();
  } catch (error) {
    logger.error("Error handler", new Error("Internal Server Error~"));
    if (res?.status) return res?.status(500).json({ message: "Internal Server Error!" });
  }
};
