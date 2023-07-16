import httpStatus from "http-status";
import { User } from "../../models/User/User.model";
import { UserProps } from "../../models/User/User.types";
import { ApiError } from "../../utils/ApiError";
import { RecaptchaService } from "../Recaptcha";

export const create = async (userBody: UserProps, recaptcha: string) => {
  if (!recaptcha) throw new ApiError(httpStatus.BAD_REQUEST, "Hmmm, something is missing hehehehehehehehhehe");

  await RecaptchaService.validateRecaptcha(recaptcha);
  return await User.create(userBody);
};
