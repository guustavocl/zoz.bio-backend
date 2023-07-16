import { countByPagename, countByUser } from "./page.count";
import { create, validateNumberOfPages, validatePagenameLenght } from "./page.create";
import { findOne, findAll, findAllUserPages, findByPagename, findByPagenameAndUserOwner } from "./page.find";
import {
  updatePageBadges,
  updatePageColors,
  updatePageInfos,
  updatePageLinks,
  updatePageSocialMedia,
  updatePageAvatar,
  updatePageBackground,
} from "./page.update";

export const PageService = {
  create,
  findOne,
  findAll,
  findByPagename,
  findByPagenameAndUserOwner,
  findAllUserPages,
  updatePageLinks,
  countByPagename,
  countByUser,
  validatePagenameLenght,
  validateNumberOfPages,
  updatePageInfos,
  updatePageBadges,
  updatePageSocialMedia,
  updatePageColors,
  updatePageAvatar,
  updatePageBackground,
};
