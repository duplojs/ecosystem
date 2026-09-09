import * as DChrono from "@scripts/chrono";
import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import { ErrorSymbol, SuccessSymbol } from "../../common";
import { createFundamentalType, type FundamentalType } from "../base";
import { createKind } from "../../kind";

export const timeFundamentalTypeKind = createKind("time-fundamental-type");

export interface TheTime extends DCommon.Forward<
	& FundamentalType<DChrono.TheTime>
	& DKind.Kind<typeof timeFundamentalTypeKind>
> {}

export const TheTime = createFundamentalType<
	TheTime
>(
	timeFundamentalTypeKind,
	(self, data) => data instanceof DChrono.TheTime
		? SuccessSymbol
		: ErrorSymbol,
);
