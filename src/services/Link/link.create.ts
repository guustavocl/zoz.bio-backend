import { LinkService } from ".";
import { Link } from "../../models/Link/Link.model";
import { LinkProps } from "../../models/Link/Link.types";
import { PageProps } from "../../models/Page/Page.types";
import { PageService } from "../Page";

export const create = async (linkBody: LinkProps, page: PageProps) => {
  const countLinks = await LinkService.countLinks(page._id, linkBody.folderOwner._id);

  createEmbeddedUrl(linkBody);

  const newLink = await Link.create({
    url: linkBody.url,
    label: linkBody.label, //TODO can filter label here later for bad words
    embedded: !linkBody.isFolder ? linkBody.embedded : "none",
    isFolder: linkBody.isFolder,
    icon: linkBody.isFolder ? "folder" : "link",
    pageOwner: page,
    position: countLinks + 1,
    isPlaylist: linkBody.isPlaylist,
    folderOwner: !linkBody.isFolder && linkBody?.folderOwner ? linkBody.folderOwner : undefined,
  });

  if (newLink) {
    await PageService.updatePageLinks(page._id, page.userOwner?._id);
  }
};

export const createEmbeddedUrl = (linkBody: LinkProps) => {
  if (linkBody.embedded !== "none") {
    if (linkBody.embedded === "spotify") {
      linkBody.isPlaylist = linkBody.url.includes("playlist");
      const urlArray = linkBody.url.split("/").reverse();
      linkBody.url = `${linkBody.isPlaylist ? "playlist/" : "track/"}${urlArray[0]}`;
    } else if (linkBody.embedded === "soundcloud") {
      linkBody.url = linkBody.url.replace("https://soundcloud.com", "");
    } else {
      const urlArray = linkBody.url.split("=").reverse();
      linkBody.url = urlArray[0];
    }
  }
};
