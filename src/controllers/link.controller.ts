import { NextFunction, Request, Response } from "express";
import Link, { LinkProps } from "../models/Link";
import Page from "../models/Page";
import logger from "../utils/logger";

const getFolders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pagename } = req.query;
    const { userPayload } = res.locals;
    if (pagename) {
      const page = await Page.findOne({
        userOwner: userPayload._id,
        pagename: pagename,
      });
      if (page) {
        const folders = await Link.find({
          isFolder: true,
          pageOwner: page._id,
        });
        return res.status(200).json({
          folders: folders,
        });
      }
    }
    res.status(404).json({ message: "Page not found!" });
  } catch (error) {
    next(error);
  }
};

const createLink = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { link, pagename } = req.body;
    const { userPayload } = res.locals;

    const page = await Page.findOne({
      userOwner: userPayload ? userPayload._id : null,
      pagename: pagename,
    });

    if (userPayload && page) {
      let newLink;
      const countLinks = await Link.countDocuments({
        pageOwner: page,
        folderOnwer: link.folderOnwer ? link.folderOnwer : null,
      });

      if (link.isFolder) {
        newLink = await new Link({
          label: link.label, //TODO can filter label here later for bad words
          icon: link.icon ? link.icon : "folder",
          embedded: "none",
          isFolder: true,
          pageOwner: page,
          position: countLinks + 1,
        })
          .save()
          .then(async (saved: LinkProps) => {
            return saved;
          })
          .catch(error => {
            next(error);
          });
      } else {
        //TODO check total links and folder max free created is 10
        let url = link.url;
        if (link.embedded !== "none") {
          if (link.embedded === "spotify") {
            const urlArray = url.split("/").reverse();
            url = urlArray[0];
          } else if (link.embedded === "soundcloud") {
            url = url.replace("https://soundcloud.com", "");
          } else {
            const urlArray = url.split("=").reverse();
            url = urlArray[0];
          }
        }

        newLink = await new Link({
          url: url, //TODO validade safe urls here later
          label: link.label, //TODO can filter label here later for bad words
          icon: link.icon ? link.icon : "link",
          embedded: link.embedded,
          pageOwner: page,
          folderOwner: link.folderOwner ? link.folderOwner : null,
          position: countLinks + 1,
        })
          .save()
          .then(async (saved: LinkProps) => {
            return saved;
          })
          .catch(error => {
            next(error);
          });
      }

      if (newLink) {
        logger.info(newLink.toJSON(), "New Link created");
        const allLinks = await Link.find({ pageOwner: page });

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
      }
    }
    return res.status(400).json({
      message: "Something went wrong D:",
    });
  } catch (error) {
    next(error);
  }
};

const updateLink = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // const { uname, email, password } = req.body;
  } catch (error) {
    next(error);
  }
};

export default {
  getFolders,
  createLink,
  updateLink,
};
