import type * as DCommon from "@scripts/common";

export interface SomePredicateFunctionParams<
	GenericInputArray extends readonly unknown[],
> {
	index: number;
	self: GenericInputArray;
}

export function some<
	GenericArray extends readonly unknown[],
>(
	predicate: (
		element: GenericArray[number],
		params: SomePredicateFunctionParams<GenericArray>,
	) => boolean,
): (
	array: GenericArray,
) => boolean;

export function some<
	GenericArray extends readonly unknown[],
>(
	array: GenericArray,
	predicate: (
		element: GenericArray[number],
		params: SomePredicateFunctionParams<GenericArray>,
	) => boolean,
): boolean;

export function some(
	...args:
		| [predicate: DCommon.AnyFunction]
		| [array: readonly unknown[], predicate: DCommon.AnyFunction]
) {
	if (args.length === 1) {
		const [predicate] = args;

		return (array: readonly unknown[]) => some(array, predicate);
	}

	const [array, predicate] = args;

	return array.some(
		(element, index) => predicate(
			element,
			{
				index,
				self: array,
			},
		),
	);
}
