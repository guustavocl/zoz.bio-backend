import { Document } from "mongoose";
import { LinkProps } from "../Link/Link.types";
import { UserProps } from "../User/User.types";

export interface ColorProps {
  r: number;
  g: number;
  b: number;
}

export interface PageStatusProps {
  key: string;
  message: string;
}

export interface PageSocialMediaProps {
  username: string;
  key: string;
}

export interface PageProps extends Document {
  pagename: string;
  uname: string;
  status: PageStatusProps;
  bio: string;
  pfpUrl: string;
  bannerUrl: string;
  backgroundUrl: string;
  backgroundOpacity: string;
  primaryColor: ColorProps;
  secondaryColor: ColorProps;
  userOwner: UserProps;
  subscription: string;
  isUnderConstruction: boolean;
  isPrivate: boolean;
  privatePassword: string;
  isBanned: boolean;
  isBlocked: boolean;
  isMod: boolean;
  isAdmin: boolean;
  adornment: string;
  fontColor: string;
  backgroundSize: string;
  backGroundOpacity: number;
  cardBlur: string;
  cardHueRotate: string;
  badges: string[];
  socialMedias: PageSocialMediaProps[];
  pageLinks: LinkProps[];
  createdAt: Date;
  updatedAt: Date;
}
