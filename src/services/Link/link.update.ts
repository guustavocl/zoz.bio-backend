import { Link } from "../../models/Link/Link.model";
import { LinkProps } from "../../models/Link/Link.types";
import { PageProps } from "../../models/Page/Page.types";
import { PageService } from "../Page";
import { createEmbeddedUrl } from "./link.create";

export const update = async (linkBody: LinkProps, page: PageProps) => {
  createEmbeddedUrl(linkBody);

  const updatedLink = await Link.findOneAndUpdate(
    { _id: linkBody._id, pageOwner: page },
    {
      url: linkBody.url,
      label: linkBody.label, //TODO can filter label here later for bad words
      embedded: linkBody.embedded,
      isPlaylist: linkBody.isPlaylist,
      folderOwner: !linkBody.isFolder && linkBody?.folderOwner ? linkBody.folderOwner : undefined,
    }
  );
  if (updatedLink) {
    await PageService.updatePageLinks(page._id, page.userOwner?._id);
  }
};
