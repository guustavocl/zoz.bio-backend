import { model, models, PaginateModel, Schema } from "mongoose";
import { PageProps } from "./Page.types";
import { LinkProps } from "../Link/Link.types";
import mongoosePaginate from "mongoose-paginate-v2";
import { MIN_LENGTH_MSG, MAX_LENGTH_MSG } from "../../utils/constants";

const PageSchema = new Schema(
  {
    pagename: {
      type: String,
      required: [true, "Please inform a page name"],
      minLength: [1, MIN_LENGTH_MSG("Pagename", 1)],
      maxLength: [30, MAX_LENGTH_MSG("Pagename", 30)],
      unique: [true, "Pagename is already in use, choose another name"],
    },
    uname: {
      type: String,
      maxLength: [25, MAX_LENGTH_MSG("Name", 25)],
    },
    status: { key: String, message: String },
    bio: {
      type: String,
      maxLength: [200, MAX_LENGTH_MSG("Bio", 200)],
    },
    pfpUrl: { type: String },
    bannerUrl: { type: String },
    backgroundUrl: { type: String },
    backgroundOpacity: { type: String },
    primaryColor: { type: Object },
    secondaryColor: { type: Object },
    userOwner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subscription: {
      type: String,
      enum: ["mod", "vip", "partner", "member", "org", "pix", "gift", "none"],
      default: "none",
    },
    isUnderConstruction: { type: Boolean, default: false },
    isPrivate: { type: Boolean, default: false },
    privatePassword: {
      type: String,
      minLength: [3, MIN_LENGTH_MSG("Page password", 3)],
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

PageSchema.plugin(mongoosePaginate);

PageSchema.path("pagename").validate(
  async (pagename: string) => {
    const pagesCount = await models.Page.countDocuments({
      pagename: { $regex: new RegExp(`^${pagename}$`, "i") },
    });
    return !pagesCount;
  },
  "This Page name is already is use!",
  "DUPLICATED"
);

export const Page = model<PageProps, PaginateModel<PageProps>>("Page", PageSchema);
