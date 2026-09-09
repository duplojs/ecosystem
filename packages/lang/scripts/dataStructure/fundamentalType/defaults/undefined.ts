import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import { ErrorSymbol, SuccessSymbol } from "../../common";
import { createFundamentalType, type FundamentalType } from "../base";
import { createKind } from "../../kind";

export const undefinedFundamentalTypeKind = createKind("undefined-fundamental-type");

export interface TheUndefined extends DCommon.Forward<
	& FundamentalType<undefined>
	& DKind.Kind<typeof undefinedFundamentalTypeKind>
> {}

export const TheUndefined = createFundamentalType<
	TheUndefined
>(
	undefinedFundamentalTypeKind,
	(self, data) => data === undefined
		? SuccessSymbol
		: ErrorSymbol,
);
