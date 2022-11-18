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
      console.log("total pages do user: ", countPages);

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

      //everything went fine so proceedo to create the page
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

export default {
  getPage,
  createPage,
};
