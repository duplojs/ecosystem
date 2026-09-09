import type * as DCommon from "@scripts/common";
import type { ReapplyCompatiblesConstraints } from "./constraints";

export interface FindAndReplacePredicateFunctionParams<
	GenericArray extends readonly unknown[] = readonly unknown[],
> {
	index: number;
	self: GenericArray;
}

type FindAndReplaceOutput<
	GenericArray extends readonly unknown[],
	GenericValue extends DCommon.AnyValue,
> = GenericArray extends unknown
	? (
		| ReapplyCompatiblesConstraints<GenericArray, readonly (GenericArray[number] | GenericValue)[]>
		| undefined
	)
	: never;

export function findAndReplace<
	GenericArray extends readonly unknown[],
	GenericValue extends DCommon.AnyValue,
>(
	predicate: (
		element: GenericArray[number],
		params: FindAndReplacePredicateFunctionParams<GenericArray>,
	) => boolean,
	value: GenericValue,
): (
	array: GenericArray,
) => Extract<FindAndReplaceOutput<GenericArray, GenericValue>, any>;

export function findAndReplace<
	GenericArray extends readonly unknown[],
	GenericValue extends DCommon.AnyValue,
>(
	array: GenericArray,
	predicate: (
		element: GenericArray[number],
		params: FindAndReplacePredicateFunctionParams<GenericArray>,
	) => boolean,
	value: GenericValue,
): Extract<FindAndReplaceOutput<GenericArray, GenericValue>, any>;

export function findAndReplace(
	...args:
		| [predicate: DCommon.AnyFunction, value: DCommon.AnyValue]
		| [array: readonly unknown[], predicate: DCommon.AnyFunction, value: DCommon.AnyValue]
): any {
	if (args.length === 2) {
		const [predicate, value] = args;

		return (array: readonly unknown[]) => findAndReplace(array, predicate, value);
	}

	const [array, predicate, value] = args;

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
			const newArray = array.slice();
			newArray[index] = value;
			return newArray;
		}
	}

	return undefined;
}
