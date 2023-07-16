import { Link } from "../../models/Link/Link.model";

export const countLinks = async (pageId: string, folderId?: string) => {
  return await Link.countDocuments({
    pageOwner: pageId,
    folderOnwer: folderId || null,
  });
};
