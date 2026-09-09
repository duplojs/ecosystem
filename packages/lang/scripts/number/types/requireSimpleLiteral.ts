import type * as DCommon from "@scripts/common";

export type RequireSimpleLiteral<
	GenericNumber extends number,
> = GenericNumber extends DCommon.BaseConstraint
	? DCommon.ComputedTypeError<"Constrained numbers are not allowed.">
	: DCommon.IsEqual<GenericNumber, number> extends true
		? DCommon.ComputedTypeError<"Must be a literal number, not the generic 'number'">
		: unknown;
