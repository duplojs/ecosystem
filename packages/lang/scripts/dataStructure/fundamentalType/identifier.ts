import * as DKind from "@scripts/kind";
import { type FundamentalType } from "./base";
import { type FundamentalTypes } from "./types";

export const fundamentalTypeIdentifier = DKind.createKindIdentifier<
	FundamentalType,
	FundamentalTypes
>();
