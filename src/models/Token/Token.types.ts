import { Document } from "mongoose";
import { UserProps } from "../User/User.types";

export interface TokenProps extends Document {
  hash: string;
  type: "confirmEmail" | "resetPwd";
  userOwner: UserProps;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
