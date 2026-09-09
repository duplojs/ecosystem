import * as DKind from "@scripts/kind";
import { type Type } from "./base";
import { type Types } from "./types";

export const typeIdentifier = DKind.createKindIdentifier<
	Type,
	Types
>();
