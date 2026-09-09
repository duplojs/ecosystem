import type * as DString from "@scripts/string";
import { type Segment } from "./constraints";
import { type IsLiteralSegmentPath } from "./types";

export function isSegment<
	GenericValue extends string,
>(
	value: GenericValue,
): value is (
	GenericValue extends Segment
		? GenericValue
		: IsLiteralSegmentPath<GenericValue> extends true
			? GenericValue
			: DString.IsLiteral<GenericValue> extends true
				? never
				: GenericValue & Segment
);

export function isSegment(
	value: string,
): boolean {
	return value !== ""
		&& value !== "."
		&& value !== ".."
		&& !value.includes("/")
		&& !value.includes("\0");
}
