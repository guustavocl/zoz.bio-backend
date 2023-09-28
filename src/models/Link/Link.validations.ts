import { Types } from "mongoose";
import { z } from "zod";
import { MAX_LENGTH_MSG, MIN_LENGTH_MSG } from "../../utils/constants";

const create = z.object({
  body: z.object({
    pagename: z
      .string({
        required_error: "Pagename is required",
      })
      .min(1, MIN_LENGTH_MSG("Pagename", 1)),
    link: z.object({
      url: z.string().optional(),
      embedded: z.string(),
      label: z
        .string({
          required_error: "Label is required",
        })
        .min(1, MIN_LENGTH_MSG("Label", 1))
        .max(30, MAX_LENGTH_MSG("Label", 30)),
      isFolder: z.boolean(),
      folderOwner: z
        .string()
        .optional()
        .refine(val => {
          return !val || Types.ObjectId.isValid(val);
        }, "Must be a valid linkId"),
    }),
  }),
});

const update = z.object({
  body: z.object({
    pagename: z
      .string({
        required_error: "Pagename is required",
      })
      .min(1, MIN_LENGTH_MSG("Pagename", 1)),
    link: z.object({
      _id: z.string().refine(val => {
        return Types.ObjectId.isValid(val);
      }, "Must be a valid linkId"),
      url: z.string().optional(),
      embedded: z.string(),
      label: z
        .string({
          required_error: "Label is required",
        })
        .min(1, MIN_LENGTH_MSG("Label", 1))
        .max(30, MAX_LENGTH_MSG("Label", 30)),
      folderOwner: z
        .string()
        .optional()
        .refine(val => {
          return !val || Types.ObjectId.isValid(val);
        }, "Must be a valid linkId"),
    }),
  }),
});

const remove = z.object({
  body: z.object({
    linkId: z.string().refine(val => {
      return Types.ObjectId.isValid(val);
    }, "Must be a valid linkId"),
    pagename: z
      .string({
        required_error: "Pagename is required",
      })
      .min(1, MIN_LENGTH_MSG("Pagename", 1)),
  }),
});

const getOne = z.object({
  query: z.object({
    linkId: z.string().refine(val => {
      return Types.ObjectId.isValid(val);
    }, "Must be a valid linkId"),
  }),
});

const getAll = z.object({
  query: z.object({
    name: z.string().optional(),
    sort: z.string().optional(),
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

const getFolders = z.object({
  query: z.object({
    pagename: z
      .string({
        required_error: "Pagename is required",
      })
      .min(1, MIN_LENGTH_MSG("Pagename", 1)),
  }),
});

export const LinkValidations = { create, update, remove, getOne, getAll, getFolders };
