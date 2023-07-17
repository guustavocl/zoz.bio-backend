import httpStatus from "http-status";
import { User } from "../../models/User/User.model";
import { ApiError } from "../../utils/ApiError";
import { TokenService } from "../Token";

export const confirmEmail = async (hash: string) => {
  const confirmationToken = await TokenService.findByHash(hash);
  if (confirmationToken && confirmationToken.hash === hash) {
    await confirmationToken.deleteOne();
    await User.findOneAndUpdate({ _id: confirmationToken.userOwner }, { isEmailConfirmed: true });
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, "Confirmation failed, Invalid token");
  }
};
