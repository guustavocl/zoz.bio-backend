import { create } from "./token.create";
import { findOne, findByUser, findByHash } from "./token.find";

export const TokenService = { create, findOne, findByUser, findByHash };
