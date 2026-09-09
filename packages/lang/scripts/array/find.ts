import type * as DCommon from "@scripts/common";

export interface FindPredicateFunctionParams<
	GenericArray extends readonly unknown[] = readonly unknown[],
> {
	index: number;
	self: GenericArray;
}

export function find<
	GenericArray extends readonly unknown[],
	GenericOutput extends GenericArray[number],
>(
	predicate: (
		element: GenericArray[number],
		params: FindPredicateFunctionParams<GenericArray>,
	) => element is GenericOutput,
): (
	array: GenericArray,
) => GenericOutput | undefined;

export function find<
	GenericArray extends readonly unknown[],
	GenericOutput extends GenericArray[number],
>(
	array: GenericArray,
	predicate: (
		element: GenericArray[number],
		params: FindPredicateFunctionParams<GenericArray>,
	) => element is GenericOutput,
): GenericOutput | undefined;

export function find<
	GenericArray extends readonly unknown[],
>(
	predicate: (
		element: GenericArray[number],
		params: FindPredicateFunctionParams<GenericArray>,
	) => boolean,
): (
	array: GenericArray,
) => GenericArray[number] | undefined;

export function find<
	GenericArray extends readonly unknown[],
>(
	array: GenericArray,
	predicate: (
		element: GenericArray[number],
		params: FindPredicateFunctionParams<GenericArray>,
	) => boolean,
): GenericArray[number] | undefined;

export function find(
	...args:
		| [predicate: DCommon.AnyFunction]
		| [array: readonly unknown[], predicate: DCommon.AnyFunction]
) {
	if (args.length === 1) {
		const [predicate] = args;

		return (array: readonly unknown[]) => find(array, predicate);
	}
	const [array, predicate] = args;

	return array.find(
		(element, index) => predicate(
			element,
			{
				index,
				self: array,
			},
		),
	);
}
