import { Document } from "mongoose";
import { PageProps } from "../Page/Page.types";

export interface LinkProps extends Document {
  url: string;
  label: string;
  icon: string;
  embedded: string;
  isPlaylist: boolean;
  isHidden: boolean;
  isFolder: boolean;
  position: number;
  timesClicked: number;
  pageOwner: PageProps;
  folderOwner: LinkProps;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
