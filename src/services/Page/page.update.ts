import fs from "fs";
import httpStatus from "http-status";
import sharp from "sharp";
import { config } from "../../config";
import { Page } from "../../models/Page/Page.model";
import { PageProps, PageSocialMediaProps } from "../../models/Page/Page.types";
import { UserProps } from "../../models/User/User.types";
import { ApiError } from "../../utils/ApiError";
import { LinkService } from "../Link";
import { validatePagenameLenght } from "./page.create";

export const updatePageLinks = async (pageId: string, userId: string) => {
  const allLinks = await LinkService.findAllVisible(pageId);
  return await Page.updateOne({ _id: pageId, userOwner: userId }, { pageLinks: allLinks });
};

export const updatePageInfos = async (pageBody: PageProps, user: UserProps, newPagename: string) => {
  await validatePagenameLenght(newPagename, user.subscription);

  return await Page.findOneAndUpdate(
    { userOwner: user, pagename: pageBody.pagename },
    { uname: pageBody.uname, bio: pageBody.bio, pagename: newPagename }
  );
};

export const updatePageBadges = async (pagename: string, userId: string, badges: string[]) => {
  return await Page.findOneAndUpdate({ userOwner: userId, pagename: pagename }, { badges });
};

export const updatePageSocialMedia = async (pagename: string, userId: string, socialMedias: PageSocialMediaProps[]) => {
  return await Page.findOneAndUpdate({ userOwner: userId, pagename: pagename }, { socialMedias });
};

export const updatePageColors = async (pageBody: PageProps, userId: string) => {
  return await Page.findOneAndUpdate(
    { userOwner: userId, pagename: pageBody.pagename },
    { primaryColor: pageBody.primaryColor, secondaryColor: pageBody.secondaryColor, fontColor: pageBody.fontColor }
  );
};

export const updatePageAvatar = async (pagename: string, userId: string, file: Express.Multer.File) => {
  const imagePath = file.destination.replace("uploads", "images");

  await sharp(file.path, { pages: -1 })
    .resize(400, 400, { fit: "inside" })
    .webp()
    .toFile(`${imagePath}/avatar.webp`, async err => {
      if (err) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Something went while converting your avatar D:");
      if (file?.path)
        await fs.unlink(file.path, function (err) {
          if (err)
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Something went while unlinking your avatar D:");
        });
    });

  return await Page.findOneAndUpdate(
    { userOwner: userId, pagename: pagename },
    {
      pfpUrl: `${config.apiUrl}${imagePath}/avatar.webp?v=${new Date().getTime()}`,
    }
  );
};

export const updatePageBackground = async (pagename: string, userId: string, file: Express.Multer.File) => {
  const imagePath = file.destination.replace("uploads", "images");

  await sharp(file.path, { pages: -1 })
    // .resize(400, 400, { fit: "inside" })
    .webp()
    .toFile(`${imagePath}/bg.webp`, async err => {
      if (err)
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Something went while converting your background D:");

      if (file?.path)
        fs.unlink(file.path, function (err) {
          if (err)
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Something went while unlinking your background D:");
        });
    });
  return await Page.findOneAndUpdate(
    { userOwner: userId, pagename: pagename },
    {
      backgroundUrl: `${config.apiUrl}${imagePath}/bg.webp?v=${new Date().getTime()}`,
    }
  );
};
