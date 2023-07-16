import axios from "axios";
import { config } from "../../config";
import httpStatus from "http-status";
import { ApiError } from "../../utils/ApiError";

const validateRecaptcha = async (recaptcha: string) => {
  const response = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${config.recaptchaSecret}&response=${recaptcha}`
  );

  // ["error-codes"] includes "timeout-or-duplicate"
  if (!response?.data?.success)
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Maybe your token has expired, request a new recaptcha token and try again"
    );

  if (config.production && response?.data?.hostname !== "zoz.bio")
    throw new ApiError(httpStatus.BAD_REQUEST, "Hmmm, your doin something nasty, go away!");
};

export const RecaptchaService = { validateRecaptcha };
