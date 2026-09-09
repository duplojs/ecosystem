import type * as DArray from "@scripts/array";

export function maxOf<
	GenericValues extends readonly number[],
>(
	values: GenericValues & DArray.RequireAtLeastElements<GenericValues, 1>,
): number {
	let result = values[0]!;

	for (let index = 1; index < values.length; index++) {
		const value = values[index]!;

		if (value > result) {
			result = value;
		}
	}

	return result;
}
