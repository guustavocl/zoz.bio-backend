import { Link } from "../../models/Link/Link.model";
import { PageProps } from "../../models/Page/Page.types";
import { PageService } from "../Page";

export const softRemove = async (linkId: string, page: PageProps) => {
  const updatedLink = await Link.findOneAndUpdate(
    { _id: linkId, pageOwner: page },
    {
      deletedAt: new Date(),
    },
    { new: true }
  );
  if (updatedLink) {
    await PageService.updatePageLinks(page._id, page.userOwner?._id);
  }
};
