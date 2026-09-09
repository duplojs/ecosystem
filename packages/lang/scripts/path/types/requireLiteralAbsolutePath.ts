import type * as DCommon from "@scripts/common";
import { type IsLiteralAbsolutePath } from "./isLiteralAbsolutePath";

export type RequireLiteralAbsolutePath<
	GenericValue extends string,
> = IsLiteralAbsolutePath<GenericValue> extends true
	? unknown
	: DCommon.ComputedTypeError<"Value is not a absolute path.">;
