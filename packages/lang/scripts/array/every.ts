import type * as DCommon from "@scripts/common";

export interface EveryPredicateFunctionParams<
	GenericArray extends readonly unknown[] = readonly unknown[],
> {
	index: number;
	self: GenericArray;
}

export function every<
	GenericArray extends readonly unknown[],
>(
	predicate: (
		element: GenericArray[number],
		params: EveryPredicateFunctionParams<GenericArray>,
	) => boolean,
): (
	array: GenericArray,
) => boolean;

export function every<
	GenericArray extends readonly unknown[],
>(
	array: GenericArray,
	predicate: (
		element: GenericArray[number],
		params: EveryPredicateFunctionParams<GenericArray>,
	) => boolean,
): boolean;

export function every(
	...args:
		| [predicate: DCommon.AnyFunction]
		| [array: readonly unknown[], predicate: DCommon.AnyFunction]
) {
	if (args.length === 1) {
		const [predicate] = args;

		return (array: readonly unknown[]) => every(array, predicate);
	}

	const [array, predicate] = args;

	return array.every(
		(element, index) => predicate(
			element,
			{
				index,
				self: array,
			},
		),
	);
}
