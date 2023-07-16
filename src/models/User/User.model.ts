import bcrypt from "bcryptjs";
import { model, models, Schema, PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { UserProps } from "./User.types";
import { MAX_LENGTH_MSG, MIN_LENGTH_MSG } from "../../utils/constants";

const UserSchema = new Schema(
  {
    uname: {
      type: String,
      required: [true, "Please inform your name"],
      minLength: [1, MIN_LENGTH_MSG("Name", 1)],
      maxLength: [50, MAX_LENGTH_MSG("Name", 50)],
    },
    email: {
      type: String,
      required: [true, "Please inform an email"],
      minLength: [5, MIN_LENGTH_MSG("Email", 5)],
      maxLength: [50, MAX_LENGTH_MSG("Email", 50)],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please inform your password"],
      minLength: [6, MIN_LENGTH_MSG("Password", 5)],
    },
    loginCount: { type: Number, default: 0 },
    lastLoginIP: { type: String },
    lastLoginDate: { type: Date },
    subscriptionUntil: { type: Date },
    subscription: {
      type: String,
      enum: ["mod", "vip", "partner", "member", "org", "pix", "gift", "none"],
      default: "none",
    },
    isSubscriptionLifetime: { type: Boolean, default: false },
    isEmailConfirmed: { type: Boolean, default: false },
    isBanned: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    isMod: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (document, returnedObject) => {
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.password;
        delete returnedObject.loginCount;
        delete returnedObject.updatedAt;
        delete returnedObject.createdAt;
        delete returnedObject.lastLoginIP;
      },
    },
  }
);

UserSchema.plugin(mongoosePaginate);

UserSchema.methods.isPasswordMatch = async function (password: string) {
  const user = this as UserProps;
  return bcrypt.compare(password, user.password);
};

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const hash = await bcrypt.hash(this.password || "", bcrypt.genSaltSync(12));
  this.password = hash;
  next();
});

UserSchema.path("email").validate(
  async (email: string) => {
    const emailRegex = new RegExp("[a-zA-Z0-9]+@[a-zA-Z0-9]+.[a-zA-Z]{2,3}");
    return emailRegex.test(email);
  },
  "This email is invalid",
  "INVALID"
);

UserSchema.path("email").validate(
  async (email: string) => {
    const emailCount = await models.User.countDocuments({ email });
    return !emailCount;
  },
  "This email is already registered!",
  "DUPLICATED"
);

export const User = model<UserProps, PaginateModel<UserProps>>("User", UserSchema);
