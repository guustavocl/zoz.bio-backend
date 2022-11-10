import mongoose from "mongoose";
import { IUser } from "./User";

export interface IToken extends mongoose.Document {
  hash: string;
  type: "confirmEmail" | "resetPwd";
  userOwner: IUser;
  createdAt: Date;
  updatedAt: Date;
}

const Token = new mongoose.Schema(
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
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, default: Date.now, expires: 3600 }, //3600 = 1hour
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IToken>("Token", Token);
