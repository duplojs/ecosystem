import type * as DCommon from "@scripts/common";
import { type IsLiteralPath } from "./isLiteralPath";

export type RequireLiteralPath<
	GenericValue extends string,
> = IsLiteralPath<GenericValue> extends true
	? unknown
	: DCommon.ComputedTypeError<"Value is not a path.">;
