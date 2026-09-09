import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import { ErrorSymbol, SuccessSymbol } from "../../common";
import { createFundamentalType, type FundamentalType } from "../base";
import { createKind } from "../../kind";

export const numberFundamentalTypeKind = createKind("number-fundamental-type");

export interface TheNumber extends DCommon.Forward<
	& FundamentalType<number>
	& DKind.Kind<typeof numberFundamentalTypeKind>
> {}

export const TheNumber = createFundamentalType<
	TheNumber
>(
	numberFundamentalTypeKind,
	(self, data) => typeof data === "number" && isFinite(data) && !isNaN(data)
		? SuccessSymbol
		: ErrorSymbol,
);
