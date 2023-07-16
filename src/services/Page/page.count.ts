import { Page } from "../../models/Page/Page.model";

export const countByPagename = async (pagename: string) => {
  return await Page.countDocuments({ pagename: pagename });
};

export const countByUser = async (userId: string) => {
  return await Page.countDocuments({ userOwner: userId });
};
