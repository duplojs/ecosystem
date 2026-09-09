import type * as DArray from "@scripts/array";

export function max<
	GenericValues extends readonly number[],
>(
	values: GenericValues & DArray.RequireAtLeastElements<GenericValues, 1>,
) {
	// Use a loop if spread inputs can become large.
	return Math.max(...values);
}
