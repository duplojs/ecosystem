import type * as DCommon from "@scripts/common";
import type * as DArray from "@scripts/array";

type SortOutput<
	GenericArray extends readonly string[],
> = DArray.ReapplyCompatiblesConstraints<GenericArray, GenericArray[number][]>;

export function sort<
	GenericArray extends readonly string[],
>(
	type: DCommon.SortType,
): (
	array: GenericArray,
) => SortOutput<GenericArray>;

export function sort<
	GenericArray extends readonly string[],
>(
	array: GenericArray,
	type: DCommon.SortType,
): SortOutput<GenericArray>;

export function sort(
	...args:
		| [DCommon.SortType]
		| [readonly string[], DCommon.SortType]
) {
	if (args.length === 1) {
		const [type] = args;

		return (array: readonly string[]) => sort(array, type);
	}

	const [array, type] = args;

	return array.slice().sort(
		type === "DSC"
			? (first, second) => {
				if (first < second) {
					return 1;
				} else if (first > second) {
					return -1;
				} else {
					return 0;
				}
			}
			: undefined,
	);
}
