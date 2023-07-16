import { Types } from "mongoose";
import { z } from "zod";
import { MIN_LENGTH_MSG, MAX_LENGTH_MSG } from "../../utils/constants";

const create = z.object({
  body: z.object({
    pagename: z
      .string({
        required_error: "Pagename is required",
      })
      .min(1, MIN_LENGTH_MSG("Pagename", 1))
      .max(30, MAX_LENGTH_MSG("Pagename", 1))
      .transform(pagename => {
        return pagename.replace(/[^a-z0-9_-]+|\s+/gim, "").toLowerCase();
      }),
  }),
});

const getOne = z.object({
  query: z.object({
    pageId: z.string().refine(val => {
      return Types.ObjectId.isValid(val);
    }, "Must be a valid userId"),
  }),
});

const getByPagename = z.object({
  query: z.object({
    pagename: z.string({ required_error: "Pagename is required" }).min(1, MIN_LENGTH_MSG("Pagename", 1)),
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

const updatePageInfo = z.object({
  body: z.object({
    pagename: z.string().min(1, MIN_LENGTH_MSG("Pagename", 1)).max(30, MAX_LENGTH_MSG("Pagename", 1)),
    newPagename: z
      .string()
      .min(1, MIN_LENGTH_MSG("Pagename", 1))
      .max(30, MAX_LENGTH_MSG("Pagename", 1))
      .optional()
      .transform(newPagename => {
        if (newPagename) return newPagename.replace(/[^a-z0-9_-]+|\s+/gim, "").toLowerCase();
      }),
    uname: z
      .string({
        required_error: "Name is required",
      })
      .min(1, MIN_LENGTH_MSG("Name", 1))
      .max(25, MAX_LENGTH_MSG("Name", 25)),
    bio: z
      .string({
        required_error: "Bio is required",
      })
      .min(1, MIN_LENGTH_MSG("Bio", 1))
      .max(200, MAX_LENGTH_MSG("Bio", 200)),
  }),
});

const updatePageBadges = z.object({
  body: z.object({
    pagename: z.string().min(1, MIN_LENGTH_MSG("Pagename", 1)).max(30, MAX_LENGTH_MSG("Pagename", 1)),
    badges: z.array(z.string()),
  }),
});

const updatePageSocialMedia = z.object({
  body: z.object({
    pagename: z.string().min(1, MIN_LENGTH_MSG("Pagename", 1)).max(30, MAX_LENGTH_MSG("Pagename", 1)),
    socialMedias: z.array(z.object({ key: z.string(), username: z.string() })),
  }),
});

const updatePageColors = z.object({
  body: z.object({
    pagename: z.string().min(1, MIN_LENGTH_MSG("Pagename", 1)).max(30, MAX_LENGTH_MSG("Pagename", 1)),
    primaryColor: z.object({ r: z.number(), g: z.number(), b: z.number(), a: z.number() }),
    secondaryColor: z.object({ r: z.number(), g: z.number(), b: z.number(), a: z.number() }),
    fontColor: z.string(),
  }),
});

const updatePageAvatar = z.object({
  query: z.object({
    pagename: z.string().min(1, MIN_LENGTH_MSG("Pagename", 1)).max(30, MAX_LENGTH_MSG("Pagename", 1)),
  }),
});

const updatePageBackground = z.object({
  query: z.object({
    pagename: z.string().min(1, MIN_LENGTH_MSG("Pagename", 1)).max(30, MAX_LENGTH_MSG("Pagename", 1)),
  }),
});

export const PageValidations = {
  create,
  getOne,
  getByPagename,
  getAll,
  updatePageInfo,
  updatePageBadges,
  updatePageSocialMedia,
  updatePageColors,
  updatePageAvatar,
  updatePageBackground,
};
