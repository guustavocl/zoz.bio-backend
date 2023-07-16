import { Token } from "../../models/Token/Token.model";

export const findOne = async (tokenId: string) => {
  return await Token.findOne({ _id: tokenId });
};

export const findByUser = async (userId: string, tokenType: string) => {
  return await Token.findOne({ userOwner: userId, type: tokenType });
};

export const findByHash = async (tokenHash: string) => {
  return await Token.findOne({ hash: tokenHash });
};
