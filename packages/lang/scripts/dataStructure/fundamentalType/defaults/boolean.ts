import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import { ErrorSymbol, SuccessSymbol } from "../../common";
import { createFundamentalType, type FundamentalType } from "../base";
import { createKind } from "../../kind";

export const booleanFundamentalTypeKind = createKind("boolean-fundamental-type");

export interface TheBoolean extends DCommon.Forward<
	& FundamentalType<boolean>
	& DKind.Kind<typeof booleanFundamentalTypeKind>
> {}

export const TheBoolean = createFundamentalType<
	TheBoolean
>(
	booleanFundamentalTypeKind,
	(self, data) => typeof data === "boolean"
		? SuccessSymbol
		: ErrorSymbol,
);
