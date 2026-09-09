import * as DChrono from "@scripts/chrono";
import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import { ErrorSymbol, SuccessSymbol } from "../../common";
import { createFundamentalType, type FundamentalType } from "../base";
import { createKind } from "../../kind";

export const dateFundamentalTypeKind = createKind("date-fundamental-type");

export interface TheDate extends DCommon.Forward<
	& FundamentalType<DChrono.TheDate>
	& DKind.Kind<typeof dateFundamentalTypeKind>
> {}

export const TheDate = createFundamentalType<
	TheDate
>(
	dateFundamentalTypeKind,
	(self, data) => data instanceof DChrono.TheDate
		? SuccessSymbol
		: ErrorSymbol,
);
