import mongoose from "mongoose";
import { IUser } from "./User";

export interface IPage extends mongoose.Document {
  pagename: string;
  uname: string;
  status: string;
  bio: string;

  pfpUrl: string;
  bannerUrl: string;
  backgroundUrl: string;
  backgroundOpacity: string;
  primaryColor: string;
  secondaryColor: string;
  userOwner: IUser;
  subscription: string;
  isUnderConstruction: boolean;
  isPrivate: boolean;
  privatePassword: string;
  isBanned: boolean;
  isBlocked: boolean;
  isMod: boolean;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const Page = new mongoose.Schema(
  {
    pagename: {
      type: String,
      required: [true, "Please inform a page name"],
      minLength: [1, "Page name must be at least 1 characters length"],
      maxLength: [30, "Page name be less than 30 characters length"],
      unique: [true, "Page name is already in use, choose another name"],
    },
    uname: {
      type: String,
      maxLength: [25, "Name must be less than 25 characters length"],
    },
    status: {
      type: String,
      maxLength: [15, "Status must be less than 15 characters length"],
    },
    bio: {
      type: String,
      maxLength: [200, "Bio must be less than 200 characters length"],
    },
    pfpUrl: { type: String },
    bannerUrl: { type: String },
    backgroundUrl: { type: String },
    backgroundOpacity: { type: String },
    primaryColor: { type: String },
    secondaryColor: { type: String },
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
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
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

Page.path("pagename").validate(
  async (pagename: string) => {
    const pagesCount = await mongoose.models.Page.countDocuments({
      pagename: { $regex: new RegExp(`^${pagename}$`, "i") },
    });
    return !pagesCount;
  },
  "This Page name is already is use!",
  "DUPLICATED"
);

export default mongoose.model<IPage>("Page", Page);
