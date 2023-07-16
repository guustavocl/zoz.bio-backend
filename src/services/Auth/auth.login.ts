import httpStatus from "http-status";
import { ApiError } from "../../utils/ApiError";
import { User } from "../../models/User/User.model";

export const login = async (email: string, password: string, loginIp = "0.0.0.0") => {
  const user = await User.findOneAndUpdate(
    { email: email },
    { $inc: { loginCount: 1 }, lastLoginIP: loginIp, lastLoginDate: new Date() }
  );
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Wrong email or password");
  }
  if (user.isBanned || user.isBlocked) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Your are banned or blocked, sorry");
  }
  return user;
};
