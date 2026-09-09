import { type FundamentalType, type fundamentalTypeKind } from "../base";
import type * as DKind from "@scripts/kind";

export type FundamentalTypeValue<
	GenericFundamentalType extends FundamentalType,
> = DKind.GetValue<
	typeof fundamentalTypeKind,
	GenericFundamentalType
>;
