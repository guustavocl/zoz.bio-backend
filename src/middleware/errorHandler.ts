import { Request, Response } from "express";
import logger from "../utils/logger";

export const errorHandler = () => (error: any, req: Request, res: Response) => {
  if (error) {
    if (typeof error === "string") {
      return res.status(400).json({ message: error });
    }

    if (error.name === "ValidationError") {
      logger.error(error, "Mongoose ValidationError");
      const errors = error.errors;
      for (const key in errors) {
        if (Object.prototype.hasOwnProperty.call(errors, key)) {
          errors[key] = errors[key]["message"];
        }
      }
      return res.status(400).json({ message: "Fix your input values and try again", errors });
    }

    if (error.name === "UnauthorizedError") {
      return res.status(401).json({ message: "Token not valid" });
    }
  }
  logger.error(error, new Error("Internal Server Error"));
  return res.status(500).json({ message: "Internal Server Error" });
};
