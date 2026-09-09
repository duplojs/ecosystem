import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import { ErrorSymbol, SuccessSymbol } from "../../common";
import { createFundamentalType, type FundamentalType } from "../base";
import { createKind } from "../../kind";

export const nullFundamentalTypeKind = createKind("null-fundamental-type");

export interface TheNull extends DCommon.Forward<
	& FundamentalType<null>
	& DKind.Kind<typeof nullFundamentalTypeKind>
> {}

export const TheNull = createFundamentalType<
	TheNull
>(
	nullFundamentalTypeKind,
	(self, data) => data === null
		? SuccessSymbol
		: ErrorSymbol,
);
