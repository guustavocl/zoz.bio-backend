import { model, Schema } from "mongoose";
import { TokenProps } from "./Token.types";

const TokenSchema = new Schema(
  {
    hash: { type: String, required: true },
    type: {
      type: String,
      enum: ["confirmEmail", "resetPwd"],
      default: "confirmEmail",
    },
    userOwner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: { type: Date, expires: 3600, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export const Token = model<TokenProps>("Token", TokenSchema);
