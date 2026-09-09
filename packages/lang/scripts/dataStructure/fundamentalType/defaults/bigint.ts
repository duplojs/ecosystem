import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import { ErrorSymbol, SuccessSymbol } from "../../common";
import { createFundamentalType, type FundamentalType } from "../base";
import { createKind } from "../../kind";

export const bigintFundamentalTypeKind = createKind("bigint-fundamental-type");

export interface TheBigint extends DCommon.Forward<
	& FundamentalType<bigint>
	& DKind.Kind<typeof bigintFundamentalTypeKind>
> {}

export const TheBigint = createFundamentalType<
	TheBigint
>(
	bigintFundamentalTypeKind,
	(self, data) => typeof data === "bigint"
		? SuccessSymbol
		: ErrorSymbol,
);
