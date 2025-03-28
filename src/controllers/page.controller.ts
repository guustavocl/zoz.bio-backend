import { Request, Response } from "express";
import httpStatus from "http-status";
import { PageValidations } from "../models/Page/Page.validations";
import { PageService } from "../services/Page";
import { ApiError } from "../utils/ApiError";
import catchAsync from "../utils/catch";
import { validate } from "../utils/validate";

const getByPagename = catchAsync(async (req: Request, res: Response) => {
  const { query } = await validate(PageValidations.getByPagename, req);
  const page = await PageService.findByPagename(query.pagename);

  if (page) return res.send({ page: page.toJSON() });
  throw new ApiError(httpStatus.NOT_FOUND, "Page not found!");
});

const getPageToEdit = catchAsync(async (req: Request, res: Response) => {
  const { query } = await validate(PageValidations.getByPagename, req);
  const { userPayload } = res.locals;
  const page = await PageService.findByPagenameAndUserOwner(query.pagename, userPayload?._id);

  if (page) return res.send({ page: page.toJSON() });
  throw new ApiError(httpStatus.NOT_FOUND, "Page not found!");
});

const checkPagename = catchAsync(async (req: Request, res: Response) => {
  const { query } = await validate(PageValidations.getByPagename, req);
  const countPages = await PageService.countByPagename(query.pagename);
  if (countPages > 0) {
    return res.send({ isAvailable: false });
  }
  return res.send({ isAvailable: true });
});

const create = catchAsync(async (req: Request, res: Response) => {
  const { body } = await validate(PageValidations.create, req);
  const { userPayload } = res.locals;
  const page = await PageService.create(body, userPayload);
  if (page) return res.status(httpStatus.CREATED).send({ message: "Page successfully created", page: page.toJSON() });
  throw new ApiError(httpStatus.NOT_FOUND, "Something went wrong!");
});

const updatePageInfo = catchAsync(async (req: Request, res: Response) => {
  const { body } = await validate(PageValidations.updatePageInfo, req);
  const { userPayload } = res.locals;

  const page = await PageService.updatePageInfos(body, userPayload, body.newPagename);
  if (page) return res.send({ message: "Page info successfully updated" });
  throw new ApiError(httpStatus.NOT_FOUND, "Page not found!");
});

const updatePageBadges = catchAsync(async (req: Request, res: Response) => {
  const { body } = await validate(PageValidations.updatePageBadges, req);
  const { userPayload } = res.locals;

  const page = await PageService.updatePageBadges(body.pagename, userPayload?._id, body.badges);
  if (page) return res.send({ message: "Page badges successfully updated" });
  throw new ApiError(httpStatus.NOT_FOUND, "Page not found!");
});

const updatePageSocialMedia = catchAsync(async (req: Request, res: Response) => {
  const { body } = await validate(PageValidations.updatePageSocialMedia, req);
  const { userPayload } = res.locals;

  const page = await PageService.updatePageSocialMedia(body.pagename, userPayload?._id, body.socialMedias);
  if (page) return res.send({ message: "Page social media successfully updated" });
  throw new ApiError(httpStatus.NOT_FOUND, "Page not found!");
});

const updatePageColors = catchAsync(async (req: Request, res: Response) => {
  const { body } = await validate(PageValidations.updatePageColors, req);
  const { userPayload } = res.locals;

  const page = await PageService.updatePageColors(body, userPayload?._id);
  if (page) return res.send({ message: "Page colors successfully updated" });
  throw new ApiError(httpStatus.NOT_FOUND, "Page not found!");
});

const updatePageAvatar = catchAsync(async (req: Request, res: Response) => {
  const { query } = await validate(PageValidations.updatePageAvatar, req);
  const { userPayload } = res.locals;

  if (req.file) {
    const page = await PageService.updatePageAvatar(query.pagename, userPayload?._id, req.file);
    if (page) return res.send({ message: "Avatar successfully updated" });
  }
  throw new ApiError(httpStatus.NOT_FOUND, "Something went wrong!");
});

const updatePageBackground = catchAsync(async (req: Request, res: Response) => {
  const { query } = await validate(PageValidations.updatePageBackground, req);
  const { userPayload } = res.locals;

  if (req.file) {
    const page = await PageService.updatePageBackground(query.pagename, userPayload?._id, req.file);
    if (page) return res.send({ message: "Avatar successfully updated" });
  }
  throw new ApiError(httpStatus.NOT_FOUND, "Something went wrong!");
});

export const PageController = {
  getByPagename,
  getPageToEdit,
  create,
  checkPagename,
  updatePageInfo,
  updatePageBadges,
  updatePageSocialMedia,
  updatePageColors,
  updatePageAvatar,
  updatePageBackground,
};
