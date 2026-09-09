import type * as DCommon from "@scripts/common";
import type { IsLiteral } from "./isLiteral";

export type RequireLiteral<
	GenericNumber extends number,
> = IsLiteral<GenericNumber> extends true
	? unknown
	: DCommon.ComputedTypeError<"Must be a literal number, not the generic 'number'">;
