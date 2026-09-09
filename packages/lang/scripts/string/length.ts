import type * as DNumber from "@scripts/number";

export function length(
	string: string,
): number & DNumber.Positive;

export function length(
	string: string,
) {
	return string.length;
}
