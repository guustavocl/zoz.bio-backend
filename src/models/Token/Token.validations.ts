import { z } from "zod";
import { MIN_LENGTH_MSG } from "../../utils/constants";

const confirmEmail = z.object({
  params: z.object({
    token: z
      .string({
        required_error: "Token hash is required",
      })
      .min(1, MIN_LENGTH_MSG("Token hash", 1)),
  }),
});

const resetPassword = z.object({
  params: z.object({
    token: z
      .string({
        required_error: "Token hash is required",
      })
      .min(1, MIN_LENGTH_MSG("Token hash", 1)),
  }),
});

export const TokenValidations = { confirmEmail, resetPassword };
