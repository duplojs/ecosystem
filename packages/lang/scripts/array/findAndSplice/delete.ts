import type * as DCommon from "@scripts/common";
import type { ReapplyCompatiblesConstraints } from "../constraints";

export interface FindAndSpliceDeletePredicateFunctionParams<
	GenericArray extends readonly unknown[] = readonly unknown[],
> {
	index: number;
	self: GenericArray;
}

type FindAndSpliceDeleteOutput<
	GenericArray extends readonly unknown[],
> = GenericArray extends unknown
	? Extract<
		| ReapplyCompatiblesConstraints<
			GenericArray,
			readonly GenericArray[number][],
			"maxElements"
		>
		| undefined,
		any
	>
	: never;

export function findAndSpliceDelete<
	GenericArray extends readonly unknown[],
>(
	predicate: (
		element: GenericArray[number],
		params: FindAndSpliceDeletePredicateFunctionParams<GenericArray>,
	) => boolean,
	deleteCount: number,
): (
	array: GenericArray,
) => Extract<FindAndSpliceDeleteOutput<GenericArray>, any>;

export function findAndSpliceDelete<
	GenericArray extends readonly unknown[],
>(
	array: GenericArray,
	predicate: (
		element: GenericArray[number],
		params: FindAndSpliceDeletePredicateFunctionParams<GenericArray>,
	) => boolean,
	deleteCount: number,
): Extract<FindAndSpliceDeleteOutput<GenericArray>, any>;

export function findAndSpliceDelete(
	...args:
		| [predicate: DCommon.AnyFunction, deleteCount: number]
		| [array: readonly unknown[], predicate: DCommon.AnyFunction, deleteCount: number]
): any {
	if (args.length === 2) {
		const [predicate, deleteCount] = args;

		return (array: readonly unknown[]) => findAndSpliceDelete(array, predicate, deleteCount);
	}

	const [array, predicate, deleteCount] = args;

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
			result.splice(index, deleteCount);

			return result;
		}
	}

	return undefined;
}
