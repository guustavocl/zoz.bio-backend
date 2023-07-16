import { Document } from "mongoose";

export interface UserProps extends Document {
  uname: string;
  email: string;
  password: string;
  loginCount: string;
  lastLoginIP: string;
  lastLoginDate: Date;
  subscriptionUntil: Date;
  subscription: string;
  isEmailConfirmed: boolean;
  isBanned: boolean;
  isBlocked: boolean;
  isMod: boolean;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
  isPasswordMatch: (email: string) => boolean;
}
