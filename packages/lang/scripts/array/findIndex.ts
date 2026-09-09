import type * as DCommon from "@scripts/common";

export interface FindIndexPredicateFunctionParams<
	GenericArray extends readonly unknown[] = readonly unknown[],
> {
	index: number;
	self: GenericArray;
}

export function findIndex<
	GenericArray extends readonly unknown[],
>(
	predicate: (
		element: GenericArray[number],
		params: FindIndexPredicateFunctionParams<GenericArray>,
	) => boolean,
): (
	array: GenericArray,
) => number | undefined;

export function findIndex<
	GenericArray extends readonly unknown[],
>(
	array: GenericArray,
	predicate: (
		element: GenericArray[number],
		params: FindIndexPredicateFunctionParams<GenericArray>,
	) => boolean,
): number | undefined;

export function findIndex(
	...args:
		| [predicate: DCommon.AnyFunction]
		| [array: readonly unknown[], predicate: DCommon.AnyFunction]
) {
	if (args.length === 1) {
		const [predicate] = args;

		return (array: readonly unknown[]) => findIndex(array, predicate);
	}

	const [array, predicate] = args;

	for (let index = 0; index < array.length; index++) {
		if (
			predicate(
				array[index],
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
