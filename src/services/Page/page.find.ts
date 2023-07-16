import { FilterQuery, PaginateOptions } from "mongoose";
import { Page } from "../../models/Page/Page.model";
import { PageProps } from "../../models/Page/Page.types";

export const findOne = async (pageId: string) => {
  return await Page.findOne({ _id: pageId });
};

export const findAll = async (filter: FilterQuery<PageProps>, options: PaginateOptions) => {
  const pages = await Page.paginate(filter, options);
  return pages;
};

export const findByPagename = async (pagename: string) => {
  return await Page.findOne({ pagename: pagename });
};

export const findByPagenameAndUserOwner = async (pagename: string, userId: string) => {
  return await Page.findOne({ pagename: pagename, userOwner: userId });
};

export const findAllUserPages = async (userId: string) => {
  return await Page.find({ userOwner: userId }, { pagename: 1, uname: 1, pfpUrl: 1 });
};
