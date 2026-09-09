import type * as DCommon from "@scripts/common";
import type { ReapplyCompatiblesConstraints } from "../constraints";

export interface FindAndSpliceInsertPredicateFunctionParams<
	GenericArray extends readonly unknown[] = readonly unknown[],
> {
	index: number;
	self: GenericArray;
}

type FindAndSpliceInsertOutput<
	GenericArray extends readonly unknown[],
	GenericElements extends readonly unknown[],
> = GenericArray extends unknown
	? (
		| ReapplyCompatiblesConstraints<
			GenericArray,
			readonly (
			| GenericArray[number]
			| GenericElements[number]
			)[],
			"minElements"
		>
		| undefined
	)
	: never;

export function findAndSpliceInsert<
	GenericElements extends readonly unknown[],
>(
	predicate: (
		element: unknown,
		params: FindAndSpliceInsertPredicateFunctionParams,
	) => boolean,
	elements: GenericElements,
): <GenericArray extends readonly unknown[]>(
	array: GenericArray,
) => Extract<FindAndSpliceInsertOutput<GenericArray, GenericElements>, any>;

export function findAndSpliceInsert<
	GenericArray extends readonly unknown[],
	GenericElements extends readonly unknown[],
>(
	array: GenericArray,
	predicate: (
		element: GenericArray[number],
		params: FindAndSpliceInsertPredicateFunctionParams<GenericArray>,
	) => boolean,
	elements: GenericElements,
): Extract<FindAndSpliceInsertOutput<GenericArray, GenericElements>, any>;

export function findAndSpliceInsert(
	...args:
		| [predicate: DCommon.AnyFunction, elements: readonly unknown[]]
		| [array: readonly unknown[], predicate: DCommon.AnyFunction, elements: readonly unknown[]]
): any {
	if (args.length === 2) {
		const [predicate, elements] = args;

		return (array: readonly unknown[]) => findAndSpliceInsert(array, predicate, elements);
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
			result.splice(index, 0, ...elements);

			return result;
		}
	}

	return undefined;
}
