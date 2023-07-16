import httpStatus from "http-status";
import { Link } from "../../models/Link/Link.model";
import { ApiError } from "../../utils/ApiError";
import { PageService } from "../Page";

export const findOne = async (tokenId: string) => {
  return await Link.findOne({ _id: tokenId });
};

export const findAllVisible = async (pageId: string) => {
  return await Link.find(
    { pageOwner: pageId, deletedAt: null },
    { timesClicked: 0, deletedAt: 0, __v: 0, pageOwner: 0 }
  );
};

export const findByUser = async (userId: string, tokenType: string) => {
  return await Link.findOne({ userOwner: userId, type: tokenType });
};

export const findFoldersByPagenameAndUserOwner = async (pagename: string, userId: string) => {
  const page = await PageService.findByPagenameAndUserOwner(pagename, userId);
  if (page) return await findFolders(page._id);
  throw new ApiError(httpStatus.NOT_FOUND, "Page not found");
};

export const findFolders = async (pageId: string) => {
  return await Link.find({
    isFolder: true,
    pageOwner: pageId,
  });
};
