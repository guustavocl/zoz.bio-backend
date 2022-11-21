import { Request, Response, NextFunction } from "express";
import mime from "mime-types";
import multer from "multer";
import fs from "fs";
import Page from "../models/Page";
let page_id = "";

const multerStorage = (): multer.StorageEngine => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      if (req.res) {
        const { userPayload } = req.res.locals;
        let avatarURL = `uploads/${userPayload._id}/${page_id}/avatar`;
        if (!fs.existsSync(avatarURL)) {
          fs.mkdirSync(avatarURL, { recursive: true });
        }
        cb(null, avatarURL);
      }
    },
    filename: (req, file, cb) => {
      console.log("here 2222");
      console.log(file);
      //Aqui vamos usar o mime-type para chegar o tipo do arquivo
      //E predefinir como ele veio até nosso sistema
      const type = mime.extension(file.mimetype);
      console.log(type);
      //Renomeia o nome do arquivo
      //Aqui temos o nome do arquivo gerado pelo Date
      //E colocamos a extensão dele de acordo com o mime-type
      cb(null, `avatar.${type}`);
      // cb(null, file.originalname);
    },
  });
};

const multerFileFilter = () => {
  return (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) => {
    const type = mime.extension(file.mimetype);
    const conditions = ["png", "jpg", "jpeg"];

    if (conditions.includes(`${type}`)) {
      cb(null, true);
    }

    cb(null, false);
  };
};

const getConfig = (): multer.Options => {
  return {
    storage: multerStorage(),
    fileFilter: multerFileFilter(),
  };
};

export const uploadAvatar =
  () => async (req: Request, res: Response, next: NextFunction) => {
    const { pagename } = req.query;
    const { userPayload } = res.locals;
    const page = await Page.findOne({
      userOwner: userPayload._id,
      pagename: pagename,
    });
    if (page) {
      page_id = page._id;
      multer(getConfig()).single("avatar")(req, res, () => {
        if (!req.file)
          return res.status(400).json({
            message: "error while uploading image, try again",
          });
        next();
      });
    }
  };
