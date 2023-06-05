import mongoose from "mongoose";
import { UserProps } from "./User";

export interface TokenProps extends mongoose.Document {
  hash: string;
  type: "confirmEmail" | "resetPwd";
  userOwner: UserProps;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TokenSchema = new mongoose.Schema(
  {
    hash: { type: String, required: true },
    type: {
      type: String,
      enum: ["confirmEmail", "resetPwd"],
      default: "confirmEmail",
    },
    userOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expiresAt: { type: Date, default: Date.now, expires: 3600 }, //3600 = 1hour
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<TokenProps>("Token", TokenSchema);
