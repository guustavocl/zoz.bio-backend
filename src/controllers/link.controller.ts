import { NextFunction, Request, Response } from "express";
import Link, { ILink } from "../models/Link";
import Page from "../models/Page";
import logger from "../utils/logger";

const createLink = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { link, pagename } = req.body;
    const { userPayload } = res.locals;
    console.log(link);

    const page = await Page.findOne({
      userOwner: userPayload ? userPayload._id : null,
      pagename: pagename,
    });

    if (userPayload && page) {
      let newLink;
      let countLinks = await Link.countDocuments({
        pageOwner: page,
        folderOnwer: link.folderOnwer ? link.folderOnwer : null,
      });

      if (link.isFolder) {
        newLink = await new Link({
          label: link.label, // can filter label here later for bad words
          icon: link.icon ? link.icon : "folder",
          embedded: "none",
          isFolder: true,
          pageOwner: page,
          position: countLinks + 1,
        })
          .save()
          .then(async (saved: ILink) => {
            return saved;
          })
          .catch((error: any) => {
            next(error);
          });
      } else {
        //check total links and folder max free created is 10
        newLink = await new Link({
          url: link.url, //can validade and filter url here later,
          label: link.label, // can filter label here later for bad words
          icon: link.icon ? link.icon : "link",
          embedded: link.embedded,
          pageOwner: page,
          folderOnwer: link.folderOnwer,
          position: countLinks + 1,
        })
          .save()
          .then(async (saved: ILink) => {
            return saved;
          })
          .catch((error: any) => {
            next(error);
          });
      }

      if (newLink) {
        logger.info(newLink.toJSON(), "New Link created");
        let allLinks = await Link.find({ pageOwner: page });

        const pageSaved = await Page.findOneAndUpdate(
          { userOwner: userPayload._id, pagename: pagename },
          { pageLinks: allLinks },
          { new: true }
        );
        if (pageSaved) {
          return res.status(201).json({
            message: "Link successfully saved",
            page: pageSaved.toJSON(),
          });
        }
        res.status(404).json({
          message: "Something went wrong D:",
        });
      }
    } else {
      res.status(404).json({
        message: "Something went wrong D:",
      });
    }
  } catch (error) {
    next(error);
  }
};

const updateLink = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { uname, email, password } = req.body;
  } catch (error) {
    next(error);
  }
};

export default {
  createLink,
  updateLink,
};
