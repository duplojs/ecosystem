import type * as DCommon from "@scripts/common";

export interface FindLastIndexPredicateFunctionParams<
	GenericArray extends readonly unknown[] = readonly unknown[],
> {
	index: number;
	self: GenericArray;
}

export function findLastIndex<
	GenericArray extends readonly unknown[],
>(
	predicate: (
		element: GenericArray[number],
		params: FindLastIndexPredicateFunctionParams<GenericArray>,
	) => boolean,
): (
	array: GenericArray,
) => number | undefined;

export function findLastIndex<
	GenericArray extends readonly unknown[],
>(
	array: GenericArray,
	predicate: (
		element: GenericArray[number],
		params: FindLastIndexPredicateFunctionParams,
	) => boolean,
): number | undefined;

export function findLastIndex(
	...args:
		| [predicate: DCommon.AnyFunction]
		| [array: readonly unknown[], predicate: DCommon.AnyFunction]
) {
	if (args.length === 1) {
		const [predicate] = args;

		return (array: readonly unknown[]) => findLastIndex(array, predicate);
	}

	const [array, predicate] = args;

	for (let index = array.length - 1; index >= 0; index--) {
		const item = array[index]!;

		if (
			predicate(
				item,
				{
					index,
					self: array,
				},
			)
		) {
			return index;
		}
	}

	return undefined;
}
