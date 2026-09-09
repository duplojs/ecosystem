import type * as DCommon from "@scripts/common";
import type { IsNegative } from "./isNegative";

export type ForbiddenNegative<
	GenericNumber extends number,
> = IsNegative<GenericNumber> extends true
	? DCommon.ComputedTypeError<"Only positive number is allowed.">
	: GenericNumber;
