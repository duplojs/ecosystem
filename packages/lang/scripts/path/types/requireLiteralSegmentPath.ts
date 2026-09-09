import type * as DCommon from "@scripts/common";
import { type IsLiteralSegmentPath } from "./isLiteralSegmentPath";

export type RequireLiteralSegmentPath<
	GenericValue extends string,
> = IsLiteralSegmentPath<GenericValue> extends true
	? unknown
	: DCommon.ComputedTypeError<"Value is not a segment path.">;
