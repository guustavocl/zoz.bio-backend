import { NextFunction, Request, Response } from "express";
import Link, { LinkProps } from "../models/Link";
import Page from "../models/Page";

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
      userOwner: userPayload?._id || null,
      pagename: pagename,
    });

    if (userPayload && page && link) {
      const countLinks = await Link.countDocuments({
        pageOwner: page,
        folderOnwer: link?.folderOnwer || null,
      });
      //
      let url = link.url;
      let isPlaylist = false;
      if (link.embedded !== "none") {
        if (link.embedded === "spotify") {
          isPlaylist = link.url.includes("playlist");
          const urlArray = url.split("/").reverse();
          url = `${isPlaylist ? "playlist/" : "track/"}${urlArray[0]}`;
        } else if (link.embedded === "soundcloud") {
          url = url.replace("https://soundcloud.com", "");
        } else {
          const urlArray = url.split("=").reverse();
          url = urlArray[0];
        }
      }
      const newLink = await new Link({
        url: url,
        label: link.label, //TODO can filter label here later for bad words
        embedded: !link.isFolder ? link.embedded : "none",
        isFolder: link.isFolder,
        icon: link.isFolder ? "folder" : "link",
        pageOwner: page,
        position: countLinks + 1,
        isPlaylist: isPlaylist,
        folderOwner: !link.isFolder && link?.folderOwner ? link.folderOwner : undefined,
      })
        .save()
        .then(async (saved: LinkProps) => {
          return saved;
        })
        .catch(error => {
          next(error);
        });

      if (newLink) {
        const allLinks = await Link.find(
          { pageOwner: page, deletedAt: null },
          { timesClicked: 0, deletedAt: 0, __v: 0, pageOwner: 0 }
        );
        const pageSaved = await Page.findOneAndUpdate(
          { userOwner: userPayload._id, pagename: pagename },
          { pageLinks: allLinks }
        );
        if (pageSaved) {
          return res.status(201).json({
            message: "Link successfully saved",
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
    const { link, pagename } = req.body;
    const { userPayload } = res.locals;

    const page = await Page.findOne({
      userOwner: userPayload?._id || null,
      pagename: pagename,
    });

    if (userPayload && page && link._id) {
      let url = link.url;
      let isPlaylist = false;
      if (link.embedded !== "none") {
        if (link.embedded === "spotify") {
          isPlaylist = link.url.includes("playlist");
          const urlArray = url.split("/").reverse();
          url = `${isPlaylist ? "playlist/" : "track/"}${urlArray[0]}`;
        } else if (link.embedded === "soundcloud") {
          url = url.replace("https://soundcloud.com", "");
        } else {
          const urlArray = url.split("=").reverse();
          url = urlArray[0];
        }
      }

      const updatedLink = await Link.findOneAndUpdate(
        { _id: link._id, pageOwner: page },
        {
          url: url,
          label: link.label, //TODO can filter label here later for bad words
          embedded: link.embedded,
          isPlaylist: link.url.includes("playlist"),
          folderOwner: !link.isFolder && link?.folderOwner ? link.folderOwner : undefined,
        }
      );

      if (updatedLink) {
        const allLinks = await Link.find(
          { pageOwner: page, deletedAt: null },
          { timesClicked: 0, deletedAt: 0, __v: 0, pageOwner: 0 }
        );
        const pageSaved = await Page.findOneAndUpdate(
          { userOwner: userPayload._id, pagename: pagename },
          { pageLinks: allLinks }
        );
        if (pageSaved) {
          return res.status(201).json({
            message: "Link successfully updated",
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

const deleteLink = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { linkId, pagename } = req.body;
    const { userPayload } = res.locals;

    const page = await Page.findOne({
      userOwner: userPayload?._id || null,
      pagename: pagename,
    });

    if (userPayload && page && linkId) {
      const updatedLink = await Link.findOneAndUpdate(
        { _id: linkId, pageOwner: page },
        {
          deletedAt: new Date(),
        },
        { new: true }
      );

      if (updatedLink) {
        if (updatedLink.isFolder) {
          await Link.updateMany({ folderOwner: updatedLink, pageOwner: page }, { deletedAt: new Date() });
        }

        const allLinks = await Link.find(
          { pageOwner: page, deletedAt: null },
          { timesClicked: 0, deletedAt: 0, __v: 0, pageOwner: 0 }
        );
        const pageSaved = await Page.findOneAndUpdate(
          { userOwner: userPayload._id, pagename: pagename },
          { pageLinks: allLinks }
        );
        if (pageSaved) {
          return res.status(201).json({
            message: "Link successfully deleted",
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

export default {
  getFolders,
  createLink,
  updateLink,
  deleteLink,
};
