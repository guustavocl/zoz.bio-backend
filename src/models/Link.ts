import mongoose from "mongoose";
import { IPage } from "./Page";

export interface ILink extends mongoose.Document {
  url: string;
  label: string;
  icon: string;
  embedded: string;
  isHidden: boolean;
  isFolder: boolean;
  position: number;
  timesClicked: number;
  createdAt: Date;
  updatedAt: Date;
  pageOwner: IPage;
  folderOwner: ILink;
}

const Link = new mongoose.Schema(
  {
    url: {
      type: String,
      maxLength: [150, "Label must be less than 150 characters length"],
    },
    label: {
      type: String,
      required: [true, "Please inform your link label"],
      minLength: [1, "Label must be at least 1 characters length"],
      maxLength: [30, "Label must be less than 30 characters length"],
    },

    icon: { type: String },
    embedded: {
      type: String,
      enum: ["none", "spotify", "soundcloud", "youtube"],
      default: "none",
    },
    isHidden: { type: Boolean, default: false },
    isFolder: { type: Boolean, default: false },
    position: { type: Number },
    timesClicked: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    folderOwner: { type: mongoose.Schema.Types.ObjectId, ref: "Link" },
    pageOwner: { type: mongoose.Schema.Types.ObjectId, ref: "Page" },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (document, returnedObject) => {
        delete returnedObject.__v;
        delete returnedObject.updatedAt;
        delete returnedObject.createdAt;
        delete returnedObject.pageOwner;
      },
    },
  }
);

export default mongoose.model<ILink>("Link", Link);
