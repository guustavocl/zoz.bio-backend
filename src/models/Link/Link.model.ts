import { model, Schema } from "mongoose";
import { LinkProps } from "./Link.types";
import { MIN_LENGTH_MSG, MAX_LENGTH_MSG } from "../../utils/constants";

const LinkSchema = new Schema(
  {
    url: {
      type: String,
      maxLength: [150, MAX_LENGTH_MSG("Url", 30)],
    },
    label: {
      type: String,
      required: [true, "Please inform your link label"],
      minLength: [1, MIN_LENGTH_MSG("Label", 1)],
      maxLength: [30, MAX_LENGTH_MSG("Label", 30)],
    },

    icon: { type: String },
    embedded: {
      type: String,
      enum: ["none", "spotify", "soundcloud", "youtube"],
      default: "none",
    },
    isPlaylist: { type: Boolean, default: false },
    isHidden: { type: Boolean, default: false },
    isFolder: { type: Boolean, default: false },
    position: { type: Number },
    timesClicked: { type: Number, default: 0 },
    folderOwner: { type: Schema.Types.ObjectId, ref: "Link" },
    pageOwner: { type: Schema.Types.ObjectId, ref: "Page" },
    deletedAt: { type: Date },
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

export const Link = model<LinkProps>("Link", LinkSchema);
