import mongoose from "mongoose";
import { LinkProps } from "./Link";
import { UserProps } from "./User";

// export interface IPageLinks {
//   _id: string;
//   url: string;
//   label: string;
//   icon: string;
//   position: number;
//   isHidden: boolean;
//   isFolder: boolean;
//   embedded: string;
//   links: IPageLinks[];
// }

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
export interface PageProps extends mongoose.Document {
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

const PageSchema = new mongoose.Schema(
  {
    pagename: {
      type: String,
      required: [true, "Please inform a page name"],
      minLength: [1, "Page name must be at least 1 characters length"],
      maxLength: [30, "Page name must be less than 30 characters length"],
      unique: [true, "Page name is already in use, choose another name"],
    },
    uname: {
      type: String,
      maxLength: [25, "Name must be less than 25 characters length"],
    },
    status: { key: String, message: String },
    bio: {
      type: String,
      maxLength: [200, "Bio must be less than 200 characters length"],
    },
    pfpUrl: { type: String },
    bannerUrl: { type: String },
    backgroundUrl: { type: String },
    backgroundOpacity: { type: String },
    primaryColor: { type: Object },
    secondaryColor: { type: Object },
    userOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subscription: {
      type: String,
      enum: ["vip", "partner", "member", "org", "none"],
      default: "none",
    },
    isUnderConstruction: { type: Boolean, default: false },
    isPrivate: { type: Boolean, default: false },
    privatePassword: {
      type: String,
      minLength: [3, "Page password must be at least 3 characters length"],
    },
    isBanned: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    isMod: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    adornment: { type: String },
    fontColor: { type: String },
    backgroundSize: { type: String },
    backGroundOpacity: { type: String },
    cardBlur: { type: String },
    cardHueRotate: { type: String },
    badges: [{ type: String }],
    socialMedias: [{ key: String, username: String }],
    pageLinks: { type: Array<LinkProps> },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (document, returnedObject) => {
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.privatePassword;
        delete returnedObject.userOwner;
        delete returnedObject.updatedAt;
        delete returnedObject.createdAt;
      },
    },
  }
);

PageSchema.path("pagename").validate(
  async (pagename: string) => {
    console.log("validate pagename");
    const pagesCount = await mongoose.models.Page.countDocuments({
      pagename: { $regex: new RegExp(`^${pagename}$`, "i") },
    });
    return !pagesCount;
  },
  "This Page name is already is use!",
  "DUPLICATED"
);

export default mongoose.model<PageProps>("Page", PageSchema);
