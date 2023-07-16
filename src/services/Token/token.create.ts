import { TokenProps } from "../../models/Token/Token.types";
import { UserProps } from "../../models/User/User.types";
import { Token } from "../../models/Token/Token.model";
import { createHash } from "../../utils/jwt";

export const create = async (user: UserProps, tokenType: string): Promise<TokenProps> => {
  const hash = await createHash();
  const token = await new Token({
    hash: hash.replace(/[^a-z0-9_-]+|\s+/gim, ""),
    userOwner: user,
    type: tokenType,
  }).save();
  return token;
};
