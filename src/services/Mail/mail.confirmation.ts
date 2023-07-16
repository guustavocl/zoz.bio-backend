import { UserProps } from "../../models/User/User.types";
import { TokenService } from "../Token";
import { sendConfirmationMail } from "../../utils/mailSender";
import { TokenProps } from "../../models/Token/Token.types";
import moment from "moment";
import { ApiError } from "../../utils/ApiError";
import httpStatus from "http-status";

export const sendConfirmation = async (userBody: UserProps) => {
  let confirmEmailToken: TokenProps | null = await TokenService.findByUser(userBody._id, "confirmEmail");
  if (!confirmEmailToken) {
    confirmEmailToken = await TokenService.create(userBody, "confirmEmail");
    sendConfirmationMail(userBody.email, `http://zoz.bio/confirm/${confirmEmailToken.hash}`);
    return;
  }
  if (confirmEmailToken && moment().diff(confirmEmailToken.createdAt, "minutes") > 1) {
    sendConfirmationMail(userBody.email, `http://zoz.bio/confirm/${confirmEmailToken.hash}`);
    return;
  }
  throw new ApiError(httpStatus.BAD_REQUEST, "Wait at least one minute before request a new confirmation email");
};
