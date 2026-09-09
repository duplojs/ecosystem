import type * as DCommon from "@scripts/common";

export interface FindLastPredicateFunctionParams<
	GenericArray extends readonly unknown[] = readonly unknown[],
> {
	index: number;
	self: GenericArray;
}

export function findLast<
	GenericArray extends readonly unknown[],
	GenericOutput extends GenericArray[number],
>(
	predicate: (
		element: GenericArray[number],
		params: FindLastPredicateFunctionParams<GenericArray>,
	) => element is GenericOutput,
): (
	array: GenericArray,
) => GenericOutput | undefined;

export function findLast<
	GenericArray extends readonly unknown[],
	GenericOutput extends GenericArray[number],
>(
	array: GenericArray,
	predicate: (
		element: GenericArray[number],
		params: FindLastPredicateFunctionParams<GenericArray>,
	) => element is GenericOutput,
): GenericOutput | undefined;

export function findLast<
	GenericArray extends readonly unknown[],
	GenericOutput extends GenericArray[number],
>(
	predicate: (
		element: GenericArray[number],
		params: FindLastPredicateFunctionParams<GenericArray>,
	) => boolean,
): (
	array: GenericArray,
) => GenericOutput | undefined;

export function findLast<
	GenericArray extends readonly unknown[],
	GenericOutput extends GenericArray[number],
>(
	array: GenericArray,
	predicate: (
		element: GenericArray[number],
		params: FindLastPredicateFunctionParams<GenericArray>,
	) => boolean,
): GenericOutput | undefined;

export function findLast(
	...args:
		| [predicate: DCommon.AnyFunction]
		| [array: readonly unknown[], predicate: DCommon.AnyFunction]
): any {
	if (args.length === 1) {
		const [predicate] = args;

		return (array: readonly unknown[]) => findLast(array, predicate);
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
			return item;
		}
	}

	return undefined;
}
