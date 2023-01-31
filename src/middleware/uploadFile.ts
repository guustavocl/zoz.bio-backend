import { Request, Response, NextFunction } from "express";
import mime from "mime-types";
import multer from "multer";
import fs from "fs";
import Page from "../models/Page";
let page_id = "";

const multerBgStorage = (): multer.StorageEngine => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      if (req.res) {
        const { userPayload } = req.res.locals;
        const uploadsURL = `uploads/${userPayload._id}/${page_id}`;
        const imagesURL = `images/${userPayload._id}/${page_id}`;
        if (!fs.existsSync(imagesURL)) {
          fs.mkdirSync(imagesURL, { recursive: true });
        }
        if (!fs.existsSync(uploadsURL)) {
          fs.mkdirSync(uploadsURL, { recursive: true });
        }
        cb(null, uploadsURL);
      }
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });
};

const multerAvatarStorage = (): multer.StorageEngine => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      if (req.res) {
        const { userPayload } = req.res.locals;
        const uploadsURL = `uploads/${userPayload._id}/${page_id}`;
        const imagesURL = `images/${userPayload._id}/${page_id}`;
        if (!fs.existsSync(imagesURL)) {
          fs.mkdirSync(imagesURL, { recursive: true });
        }
        if (!fs.existsSync(uploadsURL)) {
          fs.mkdirSync(uploadsURL, { recursive: true });
        }
        cb(null, uploadsURL);
      }
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });
};

const multerFileFilter = () => {
  return (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const type = mime.extension(file.mimetype);
    const conditions = ["png", "jpg", "jpeg", "gif"];
    if (conditions.includes(`${type}`)) {
      cb(null, true);
    }
    cb(null, false);
  };
};

const getAvatarConfig = (): multer.Options => {
  return {
    storage: multerAvatarStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: multerFileFilter(),
  };
};

const getBgConfig = (): multer.Options => {
  return {
    storage: multerBgStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: multerFileFilter(),
  };
};

export const uploadAvatar = () => async (req: Request, res: Response, next: NextFunction) => {
  const { pagename } = req.query;
  const { userPayload } = res.locals;
  const page = await Page.findOne({
    userOwner: userPayload._id,
    pagename: pagename,
  });
  if (page) {
    page_id = page._id;
    multer(getAvatarConfig()).single("avatar")(req, res, () => {
      if (!req.file)
        return res.status(400).json({
          message: "File unsuported or larger than 5mb",
        });
      next();
    });
  }
};

export const uploadBackground = () => async (req: Request, res: Response, next: NextFunction) => {
  const { pagename } = req.query;
  const { userPayload } = res.locals;
  const page = await Page.findOne({
    userOwner: userPayload._id,
    pagename: pagename,
  });
  if (page) {
    page_id = page._id;
    multer(getBgConfig()).single("background")(req, res, () => {
      if (!req.file)
        return res.status(400).json({
          message: "File unsuported or larger than 5mb",
        });
      next();
    });
  }
};
