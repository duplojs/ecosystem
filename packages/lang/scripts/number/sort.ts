import type * as DArray from "@scripts/array";
import type * as DCommon from "@scripts/common";

type SortOutput<
	GenericArray extends readonly number[],
> = GenericArray extends unknown
	? DArray.ReapplyCompatiblesConstraints<
		GenericArray,
		readonly GenericArray[number][]
	>
	: never;

export function sort<
	GenericArray extends readonly number[],
>(
	type: DCommon.SortType,
): (
	array: GenericArray,
) => SortOutput<GenericArray>;

export function sort<
	GenericArray extends readonly number[],
>(
	array: GenericArray,
	type: DCommon.SortType,
): SortOutput<GenericArray>;

export function sort(
	...args:
		| [type: DCommon.SortType]
		| [array: readonly number[], type: DCommon.SortType]
): any {
	if (args.length === 1) {
		const [type] = args;

		return (array: readonly number[]) => sort(array, type);
	}

	const [array, type] = args;

	return array.slice().sort(
		type === "DSC"
			? (first, second) => second - first
			: (first, second) => first - second,
	);
}
