import type * as DCommon from "@scripts/common";

export interface FlatMapTheFunctionParams<
	GenericArray extends readonly unknown[],
> {
	index: number;
	self: GenericArray;
}

export function flatMap<
	GenericArray extends readonly unknown[],
	GenericOutput extends unknown,
>(
	theFunction: (
		element: GenericArray[number],
		params: FlatMapTheFunctionParams<GenericArray>,
	) => GenericOutput,
): (
	array: GenericArray,
) => FlatArray<GenericOutput, 1>[];

export function flatMap<
	GenericArray extends readonly unknown[],
	GenericOutput extends unknown,
>(
	array: GenericArray,
	theFunction: (
		element: GenericArray[number],
		params: FlatMapTheFunctionParams<GenericArray>,
	) => GenericOutput,
): FlatArray<GenericOutput, 1>[];

export function flatMap(
	...args:
		| [theFunction: DCommon.AnyFunction]
		| [array: readonly unknown[], theFunction: DCommon.AnyFunction]
): any {
	if (args.length === 1) {
		const [theFunction] = args;

		return (array: readonly unknown[]) => flatMap(array, theFunction);
	}

	const [array, theFunction] = args;

	return array.flatMap(
		(element, index) => theFunction(
			element,
			{
				index,
				self: array,
			},
		),
	);
}
