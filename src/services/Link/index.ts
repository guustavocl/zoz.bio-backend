import { countLinks } from "./link.count";
import { create, createEmbeddedUrl } from "./link.create";
import { findOne, findByUser, findFoldersByPagenameAndUserOwner, findAllVisible } from "./link.find";
import { softRemove } from "./link.remove";
import { update } from "./link.update";

export const LinkService = {
  create,
  update,
  softRemove,
  findOne,
  findByUser,
  findFoldersByPagenameAndUserOwner,
  countLinks,
  findAllVisible,
  createEmbeddedUrl,
};
