import { Request, Response } from "express";
import httpStatus from "http-status";
import { LinkValidations } from "../models/Link/Link.validations";
import { LinkService } from "../services/Link";
import { PageService } from "../services/Page";
import { ApiError } from "../utils/ApiError";
import catchAsync from "../utils/catch";
import { validate } from "../utils/validate";

const getOne = catchAsync(async (req: Request, res: Response) => {
  const { query } = await validate(LinkValidations.getOne, req);
  const link = await LinkService.findOne(query.linkId);

  if (link) return res.send({ link: link.toJSON() });
  throw new ApiError(httpStatus.NOT_FOUND, "Link not found!");
});

const getFolders = catchAsync(async (req: Request, res: Response) => {
  const { query } = await validate(LinkValidations.getFolders, req);
  const { userPayload } = res.locals;

  const folders = await LinkService.findFoldersByPagenameAndUserOwner(query.pagename, userPayload?._id);
  if (folders) return res.send({ folders });
  throw new ApiError(httpStatus.NOT_FOUND, "Page not found!");
});

const create = catchAsync(async (req: Request, res: Response) => {
  const { body } = await validate(LinkValidations.create, req);
  const { userPayload } = res.locals;

  const page = await PageService.findByPagenameAndUserOwner(body.pagename, userPayload?._id);
  if (page) {
    await LinkService.create(body.link, page);
    return res.status(httpStatus.CREATED).send({ message: "Link successfully saved" });
  }

  throw new ApiError(httpStatus.NOT_FOUND, "Page not found!");
});

const update = catchAsync(async (req: Request, res: Response) => {
  const { body } = await validate(LinkValidations.update, req);
  const { userPayload } = res.locals;

  const page = await PageService.findByPagenameAndUserOwner(body.pagename, userPayload?._id);
  if (page) {
    await LinkService.update(body.link, page);
    return res.status(httpStatus.CREATED).send({ message: "Link successfully updated" });
  }

  throw new ApiError(httpStatus.NOT_FOUND, "Page not found!");
});

const remove = catchAsync(async (req: Request, res: Response) => {
  const { body } = await validate(LinkValidations.remove, req);
  const { userPayload } = res.locals;

  const page = await PageService.findByPagenameAndUserOwner(body.pagename, userPayload?._id);
  if (page) {
    await LinkService.softRemove(body.linkId, page);
    return res.status(httpStatus.CREATED).send({ message: "Link successfully removed" });
  }

  throw new ApiError(httpStatus.NOT_FOUND, "Page not found!");
});

export const LinkController = {
  getOne,
  getFolders,
  create,
  update,
  remove,
};
