import type * as DArray from "@scripts/array";

export function min<
	GenericValues extends readonly number[],
>(
	values: GenericValues & DArray.RequireAtLeastElements<GenericValues, 1>,
) {
	// Use a loop if spread inputs can become large.
	return Math.min(...values);
}
