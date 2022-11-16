import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends mongoose.Document {
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
}

const User = new mongoose.Schema(
  {
    uname: {
      type: String,
      required: [true, "Please inform your name"],
      minLength: [1, "Name must be at least 1 characters length"],
      maxLength: [50, "Name must be less than 50 characters length"],
    },
    email: {
      type: String,
      required: [true, "Please inform an email"],
      minLength: [5, "Email must be at least 5 characters length"],
      maxLength: [50, "Email must be less than 50 characters length"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please inform your password"],
      minLength: [6, "Password must be at least 6 characters length"],
    },
    loginCount: { type: Number, default: 0 },
    lastLoginIP: { type: String },
    lastLoginDate: { type: Date },
    subscriptionUntil: { type: Date },
    subscription: {
      type: String,
      enum: ["vip", "partner", "member", "org", "none"],
      default: "none",
    },
    isEmailConfirmed: { type: Boolean, default: false },
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
        delete returnedObject.password;
        delete returnedObject.loginCount;
        delete returnedObject.updatedAt;
        delete returnedObject.createdAt;
        delete returnedObject.isEmailConfirmed;
      },
    },
  }
);

User.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const hash = await bcrypt.hash(this.password, bcrypt.genSaltSync(12));
  this.password = hash;
  next();
});

User.path("email").validate(
  async (email: string) => {
    let emailRegex = new RegExp("[a-zA-Z0-9]+@[a-zA-Z0-9]+.[a-zA-Z]{2,3}");
    return emailRegex.test(email);
  },
  "This email is invalid",
  "INVALID"
);
User.path("email").validate(
  async (email: string) => {
    const emailCount = await mongoose.models.User.countDocuments({ email });
    return !emailCount;
  },
  "This email is already registered!",
  "DUPLICATED"
);

export default mongoose.model<IUser>("User", User);
