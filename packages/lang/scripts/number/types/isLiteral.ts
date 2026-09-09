import type * as DCommon from "@scripts/common";
import type * as DString from "@scripts/string";

export type IsLiteral<
	GenericNumber extends number,
> = number extends GenericNumber
	? false
	: DCommon.IsNever<GenericNumber> extends true
		? false
		: DCommon.Not<
			DString.IsKeyPattern<
		`${Extract<
			DCommon.RemoveConstraint<GenericNumber>,
			number
		>}`
			>
		>;
