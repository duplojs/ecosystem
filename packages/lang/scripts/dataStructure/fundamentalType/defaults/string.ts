import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import { ErrorSymbol, SuccessSymbol } from "../../common";
import { createFundamentalType, type FundamentalType } from "../base";
import { createKind } from "../../kind";

export const stringFundamentalTypeKind = createKind("string-fundamental-type");

export interface TheString extends DCommon.Forward<
	& FundamentalType<string>
	& DKind.Kind<typeof stringFundamentalTypeKind>
> {}

export const TheString = createFundamentalType<
	TheString
>(
	stringFundamentalTypeKind,
	(self, data) => typeof data === "string"
		? SuccessSymbol
		: ErrorSymbol,
);
