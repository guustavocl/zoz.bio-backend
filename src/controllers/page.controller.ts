import { NextFunction, Request, Response } from "express";
import { config } from "../config/config";
import Page, { PageProps } from "../models/Page";
import User from "../models/User";
import logger from "../utils/logger";
import sharp from "sharp";
import fs from "fs";

const getPage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pagename } = req.query;
    if (pagename) {
      const page = await Page.findOne({
        pagename: pagename.toString().toLowerCase(),
      });
      if (page) return res.status(200).json({ page: page.toJSON() });
    }
    res.status(404).json({ message: "Page not found!" });
  } catch (error) {
    next(error);
  }
};

const getEditPage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pagename } = req.query;
    const { userPayload } = res.locals;

    if (userPayload && pagename) {
      const page = await Page.findOne({
        userOwner: userPayload._id,
        pagename: pagename.toString().toLowerCase(),
      });
      if (page) return res.status(200).json({ page: page.toJSON() });
    }

    res.status(404).json({ message: "Page not found!" });
  } catch (error) {
    next(error);
  }
};

const createPage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { pagename } = req.body;
    const { userPayload } = res.locals;
    pagename = pagename.replace(/[^a-z0-9_-]+|\s+/gim, "").toLowerCase();
    const user = await User.findOne({ _id: userPayload._id });

    if (user) {
      const countPages = await Page.countDocuments({ userOwner: user._id });

      if (pagename.length <= 1) {
        return res.status(403).json({
          message: "You can't use this pagename",
        });
      }
      if (!user.isEmailConfirmed && countPages >= 1) {
        return res.status(403).json({
          message: "You must confirm your email to create more pages",
        });
      }
      if (user.subscription === "none" && countPages >= 2) {
        return res.status(403).json({
          message: "You can't create more pages without a valid subscription",
        });
      }
      if (user.subscription === "none" && pagename.length < 4) {
        return res.status(403).json({
          message: "You can't create short name pages without a valid subscription",
        });
      }

      //everything went fine so proceed to create the page
      await new Page({
        pagename: pagename,
        userOwner: user._id,
        subscription: user.subscription,
        uname: user.uname.substring(0, 24),
        isAdmin: user.isAdmin,
        isMod: user.isMod,
      })
        .save()
        .then(async (page: PageProps) => {
          logger.info(page.toJSON(), "New Page created");
          return res.status(201).json({
            message: "Page successfully created",
            page: page.toJSON(),
          });
        })
        .catch(error => {
          next(error);
        });
    } else {
      res.status(400).json({
        message: "Something went wrong D:",
      });
    }
  } catch (error) {
    next(error);
  }
};

const checkPagename = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pagename } = req.query;
    if (pagename) {
      const countPages = await Page.countDocuments({ pagename: pagename });
      if (countPages > 0) {
        return res.status(200).json({ isAvailable: false });
      }
      return res.status(200).json({ isAvailable: true });
    }
    res.status(404).json({ message: "Invalid pagename" });
  } catch (error) {
    next(error);
  }
};

const savePageInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { uname, bio, pagename } = req.body;
    let { newPagename } = req.body;
    newPagename = newPagename.replace(/[^a-z0-9_-]+|\s+/gim, "").toLowerCase();
    const { userPayload } = res.locals;
    const user = await User.findOne({ _id: userPayload._id });
    if (user) {
      if (newPagename.length <= 1) {
        return res.status(403).json({
          message: "You can't use this pagename",
        });
      }
      if (user.subscription === "none" && newPagename.length < 4) {
        return res.status(403).json({
          message: "You can't create short name pages without a valid subscription",
        });
      }

      const pageSaved = await Page.findOneAndUpdate(
        { userOwner: userPayload._id, pagename: pagename },
        { uname, bio, pagename: newPagename },
        { new: true }
      );
      if (pageSaved) {
        return res.status(201).json({
          message: "Page successfully saved",
          page: pageSaved.toJSON(),
        });
      }
    }
    return res.status(400).json({
      message: "Something went wrong D:",
    });
  } catch (error) {
    next(error);
  }
};

const saveBadges = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { badges, pagename } = req.body;
    const { userPayload } = res.locals;

    if (userPayload) {
      const pageSaved = await Page.findOneAndUpdate(
        { userOwner: userPayload._id, pagename: pagename },
        { badges },
        { new: true }
      );
      if (pageSaved) {
        return res.status(201).json({
          message: "Page successfully saved",
          page: pageSaved.toJSON(),
        });
      }
    }
    return res.status(400).json({
      message: "Something went wrong D:",
    });
  } catch (error) {
    next(error);
  }
};

const saveSocialMedia = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { items, pagename } = req.body;
    const { userPayload } = res.locals;

    if (userPayload) {
      const pageSaved = await Page.findOneAndUpdate(
        { userOwner: userPayload._id, pagename: pagename },
        { socialMedias: items },
        { new: true }
      );
      if (pageSaved) {
        return res.status(201).json({
          message: "Page successfully saved",
          page: pageSaved.toJSON(),
        });
      }
    }
    res.status(400).json({
      message: "Something went wrong D:",
    });
  } catch (error) {
    next(error);
  }
};

const uploadAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pagename } = req.query;
    const { userPayload } = res.locals;
    const user = await User.findOne({ _id: userPayload._id });
    if (user && req.file) {
      const imagePath = req.file.destination.replace("uploads", "images");
      sharp(req.file.path, { pages: -1 })
        .resize(400, 400, { fit: "inside" })
        .webp()
        .toFile(`${imagePath}/avatar.webp`, async err => {
          if (err) {
            logger.error(err, "Error while trying to sharp file");
            return res.status(400).json({
              message: "Something went wrong D:",
            });
          }
          if (req.file?.path)
            fs.unlink(req.file.path, function (err) {
              if (err) {
                logger.error(err, "Error while trying to remove file");
              }
            });

          const pageSaved = await Page.findOneAndUpdate(
            { userOwner: user, pagename: pagename },
            {
              pfpUrl: `${config.apiUrl}${imagePath}/avatar.webp?v=${new Date().getTime()}`,
            },
            { new: true }
          );
          if (pageSaved) {
            return res.status(200).json({
              message: "Avatar successfully saved",
              page: pageSaved.toJSON(),
            });
          }
        });
    } else {
      res.status(400).json({
        message: "Something went wrong D:",
      });
    }
  } catch (error) {
    next(error);
  }
};

const uploadBackground = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pagename } = req.query;
    const { userPayload } = res.locals;
    const user = await User.findOne({ _id: userPayload._id });
    if (user && req.file) {
      const imagePath = req.file.destination.replace("uploads", "images");
      sharp(req.file.path, { pages: -1 })
        // .resize(1600, 900, { fit: "inside" })
        .webp()
        .toFile(`${imagePath}/bg.webp`, async err => {
          if (err) {
            logger.error(err, "Error while trying to sharp file");
            return res.status(400).json({
              message: "Something went wrong D:",
            });
          }
          if (req.file?.path)
            fs.unlink(req.file.path, function (err) {
              if (err) {
                logger.error(err, "Error while trying to remove file");
              }
            });

          const pageSaved = await Page.findOneAndUpdate(
            { userOwner: user, pagename: pagename },
            {
              backgroundUrl: `${config.apiUrl}${imagePath}/bg.webp?v=${new Date().getTime()}`,
            },
            { new: true }
          );
          if (pageSaved) {
            return res.status(200).json({
              message: "Background successfully saved",
              page: pageSaved.toJSON(),
            });
          }
        });
    } else {
      res.status(400).json({
        message: "Something went wrong D:",
      });
    }
  } catch (error) {
    next(error);
  }
};

const updateColors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { primaryColor, secondaryColor, fontColor, pagename } = req.body;
    const { userPayload } = res.locals;

    if (userPayload) {
      const pageSaved = await Page.findOneAndUpdate(
        { userOwner: userPayload._id, pagename: pagename },
        { primaryColor, secondaryColor, fontColor },
        { new: true }
      );
      if (pageSaved) {
        return res.status(201).json({
          message: "Color successfully saved",
          page: pageSaved.toJSON(),
        });
      }
    }
    res.status(400).json({
      message: "Something went wrong D:",
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getPage,
  getEditPage,
  createPage,
  checkPagename,
  savePageInfo,
  saveBadges,
  saveSocialMedia,
  uploadAvatar,
  uploadBackground,
  updateColors,
};
