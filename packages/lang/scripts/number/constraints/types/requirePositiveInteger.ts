import type * as DCommon from "@scripts/common";
import type { IsPositiveInteger } from "./isPositiveInteger";

export type RequirePositiveInteger<
	GenericNumber extends number,
> = IsPositiveInteger<GenericNumber> extends true
	? unknown
	: DCommon.ComputedTypeError<"Only positive integer number is allowed.">;
