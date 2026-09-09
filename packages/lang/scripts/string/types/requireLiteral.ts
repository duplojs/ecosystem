import type * as DCommon from "@scripts/common";
import { type IsLiteral } from "./isLiteral";

export type RequireLiteral<
	GenericString extends string,
> = IsLiteral<GenericString> extends true
	? unknown
	: DCommon.ComputedTypeError<"Expected value must be a string literal">;
