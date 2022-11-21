import { NextFunction, Request, Response } from "express";
import Page, { IPage } from "../models/Page";
import User, { IUser } from "../models/User";
import logger from "../utils/logger";

const getPage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { pagename } = req.query;
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

const createPage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { pagename } = req.body;
    const { userPayload } = res.locals;
    pagename = pagename.replace(/[^a-z0-9_-]+|\s+/gim, "").toLowerCase();
    const user = await User.findOne({ _id: userPayload._id });

    if (user) {
      const countPages = await Page.countDocuments({ userOwner: user._id });

      if (user.subscription === "none" && countPages >= 2) {
        return res.status(401).json({
          message: "You can't create more pages without a valid subscription",
        });
      }

      if (user.subscription === "none" && pagename.length <= 4) {
        return res.status(401).json({
          message:
            "You can't create short name pages without a valid subscription",
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
        .then(async (page: IPage) => {
          logger.info(page.toJSON(), "page created");
          return res.status(201).json({
            message: "Page successfully created",
            page: page.toJSON(),
          });
        })
        .catch((error: any) => {
          next(error);
        });
    } else {
      res.status(404).json({
        message: "Something went wrong D:",
      });
    }
  } catch (error) {
    next(error);
  }
};

const checkPagename = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let { pagename } = req.query;
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

const savePageInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let { uname, bio, pagename } = req.body;
    const { userPayload } = res.locals;

    if (userPayload) {
      let pageSaved = await Page.findOneAndUpdate(
        { userOwner: userPayload._id, pagename: pagename },
        { uname, bio },
        { new: true }
      );
      console.log(pageSaved);
      if (pageSaved) {
        return res.status(201).json({
          message: "Page successfully saved",
          page: pageSaved.toJSON(),
        });
      }
      res.status(404).json({
        message: "Something went wrong D:",
      });
    } else {
      res.status(404).json({
        message: "Something went wrong D:",
      });
    }
  } catch (error) {
    next(error);
  }
};

const uploadAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { pagename } = req.query;
    const { userPayload } = res.locals;
    console.log("controler");
    console.log(pagename);
    if (req.file) {
      console.log("tem files");
      console.log(req.file);
    }

    // console.log(req.file);

    const user = await User.findOne({ _id: userPayload._id });

    if (user) {
      //image

      // let pageSaved = await Page.findOneAndUpdate(
      //   { userOwner: user, pagename: pagename },
      //   { uname, bio },
      //   { new: true }
      // );
      // console.log(pageSaved);
      // if (pageSaved) {
      //   return res.status(201).json({
      //     message: "Page successfully saved",
      //     page: pageSaved.toJSON(),
      //   });
      // }
      return res.status(404).json({
        message: "Something went wrong D:",
      });
    } else {
      res.status(404).json({
        message: "Something went wrong D:",
      });
    }
  } catch (error) {
    next(error);
  }
};

export default {
  getPage,
  createPage,
  checkPagename,
  savePageInfo,
  uploadAvatar,
};
