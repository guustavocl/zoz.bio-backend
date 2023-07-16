import { Types } from "mongoose";
import { z } from "zod";
import { MIN_LENGTH_MSG } from "../../utils/constants";

const login = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .toLowerCase()
      .email("Insert a valid email"),
    password: z
      .string({
        required_error: "Password is required",
      })
      .min(6, MIN_LENGTH_MSG("Password")),
  }),
});

const logout = z.object({
  params: z.object({
    userId: z.string().refine(val => {
      return Types.ObjectId.isValid(val);
    }),
  }),
});

export const AuthValidations = { login, logout };
