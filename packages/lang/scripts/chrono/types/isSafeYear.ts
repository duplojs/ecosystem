import type * as DCommon from "@scripts/common";
import type * as DNumber from "@scripts/number";

export type IsSafeYear<
	GenericYears extends number,
> = DCommon.And<[
	DNumber.IsGreaterOrEqual<GenericYears, -271820>,
	DNumber.IsLessOrEqual<GenericYears, 275759>,
]>;
