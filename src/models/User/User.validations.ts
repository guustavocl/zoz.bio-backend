import { Types } from "mongoose";
import { z } from "zod";
import { MAX_LENGTH_MSG, MIN_LENGTH_MSG } from "../../utils/constants";

const create = z.object({
  body: z
    .object({
      uname: z
        .string({
          required_error: "Name is required",
        })
        .min(1, MIN_LENGTH_MSG("Name", 1))
        .max(50, MAX_LENGTH_MSG("Name", 50)),
      email: z
        .string({
          required_error: "Email is required",
        })
        .toLowerCase()
        .email("Insert a valid email")
        .min(1, MIN_LENGTH_MSG("Email", 5))
        .max(50, MAX_LENGTH_MSG("Email", 50)),
      password: z
        .string({
          required_error: "Password is required",
        })
        .min(6, MIN_LENGTH_MSG("Password", 6)),
      confirmPassword: z
        .string({
          required_error: "Password confirmation is required",
        })
        .min(6, MIN_LENGTH_MSG("Password", 6)),
      recaptcha: z
        .string({
          required_error: "Recaptcha is required",
        })
        .min(1, MIN_LENGTH_MSG("Recaptcha", 1)),
    })
    .refine(data => data.password === data.confirmPassword, {
      message: "Passwords must match!",
      path: ["confirmPassword"],
    }),
});

const getOne = z.object({
  query: z.object({
    userId: z.string().refine(val => {
      return Types.ObjectId.isValid(val);
    }, "Must be a valid userId"),
  }),
});

const getAll = z.object({
  query: z.object({
    name: z.string().optional(),
    sortBy: z.string().optional(),
    limit: z
      .string()
      .optional()
      .transform(limit => limit && parseInt(limit))
      .refine(limit => {
        if (limit && limit > 100) return false;
        return true;
      }, "Limit must be less than 100"),
    page: z
      .string()
      .transform(page => page && parseInt(page))
      .optional(),
  }),
});

export const UserValidations = { create, getOne, getAll };
