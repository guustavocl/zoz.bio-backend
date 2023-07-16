import httpStatus from "http-status";
import { Page } from "../../models/Page/Page.model";
import { PageProps } from "../../models/Page/Page.types";
import { UserProps } from "../../models/User/User.types";
import { ApiError } from "../../utils/ApiError";
import { countByPagename, countByUser } from "./page.count";

export const create = async (pageBody: PageProps, user: UserProps) => {
  const countPages = await countByPagename(pageBody.pagename);
  if (countPages > 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "This pagename is already in use");
  }

  await validateNumberOfPages(user);
  await validatePagenameLenght(pageBody.pagename, user.subscription);

  return await Page.create({
    pagename: pageBody.pagename,
    userOwner: user._id,
    subscription: user.subscription,
    uname: user.uname.substring(0, 24),
    isAdmin: user.isAdmin,
    isMod: user.isMod,
    badges: ["welcome", "new", "zoz", "member"],
  });
};

export const validatePagenameLenght = async (pagename: string, subscription: string) => {
  if (pagename.length <= 1) throw new ApiError(httpStatus.BAD_REQUEST, "You can't use this pagename");

  if (subscription === "none" && pagename.length < 4)
    throw new ApiError(httpStatus.BAD_REQUEST, "You can't create short name pages without a valid subscription");
};

export const validateNumberOfPages = async (user: UserProps) => {
  const totalUserPages = await countByUser(user._id);

  if (!user.isEmailConfirmed && totalUserPages >= 1)
    throw new ApiError(httpStatus.BAD_REQUEST, "You must confirm your email to create more pages");

  if (user.subscription === "none" && totalUserPages >= 2)
    throw new ApiError(httpStatus.BAD_REQUEST, "You can't create more pages without a valid subscription");
};
