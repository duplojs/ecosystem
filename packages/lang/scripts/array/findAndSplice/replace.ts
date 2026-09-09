import type * as DCommon from "@scripts/common";

export interface FindAndSpliceReplacePredicateFunctionParams<
	GenericArray extends readonly unknown[] = readonly unknown[],
> {
	index: number;
	self: GenericArray;
}

export function findAndSpliceReplace<
	GenericElements extends readonly unknown[],
>(
	predicate: (
		element: unknown,
		params: FindAndSpliceReplacePredicateFunctionParams,
	) => boolean,
	elements: GenericElements,
): <GenericArray extends readonly unknown[]>(
	array: GenericArray,
) => (GenericArray[number] | GenericElements[number])[] | undefined;

export function findAndSpliceReplace<
	GenericArray extends readonly unknown[],
	GenericElements extends readonly unknown[],
>(
	array: GenericArray,
	predicate: (
		element: GenericArray[number],
		params: FindAndSpliceReplacePredicateFunctionParams<GenericArray>,
	) => boolean,
	elements: GenericElements,
): (GenericArray[number] | GenericElements[number])[] | undefined;

export function findAndSpliceReplace(
	...args:
		| [predicate: DCommon.AnyFunction, elements: readonly unknown[]]
		| [array: readonly unknown[], predicate: DCommon.AnyFunction, elements: readonly unknown[]]
) {
	if (args.length === 2) {
		const [predicate, elements] = args;

		return (array: readonly unknown[]) => findAndSpliceReplace(array, predicate, elements);
	}

	const [array, predicate, elements] = args;

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
			const result = array.slice();
			// Use a loop if spread inputs can become large.
			result.splice(index, elements.length, ...elements);

			return result;
		}
	}

	return undefined;
}
