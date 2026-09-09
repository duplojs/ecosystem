import type { ReapplyCompatiblesConstraints } from "./constraints";

type PrependOutput<
	GenericArray extends readonly unknown[],
	GenericElements extends readonly unknown[],
	GenericElementsRest extends readonly unknown[][] = [],
> = GenericArray extends unknown
	? ReapplyCompatiblesConstraints<
		GenericArray,
		readonly (
			| GenericElements[number]
			| GenericElementsRest[number][number]
			| GenericArray[number]
		)[],
		"minElements"
	>
	: never;

export function prepend<
	GenericArray extends readonly unknown[],
	GenericElements extends readonly unknown[],
>(
	elements: GenericElements,
): (
	array: GenericArray,
) => PrependOutput<GenericArray, GenericElements>;

export function prepend<
	GenericArray extends readonly unknown[],
	GenericElements extends readonly unknown[],
	GenericElementsRest extends readonly unknown[][],
>(
	array: GenericArray,
	elements: GenericElements,
	...elementsRest: GenericElementsRest
): PrependOutput<GenericArray, GenericElements, GenericElementsRest>;

export function prepend(
	...args:
		| [elements: readonly unknown[]]
		| [array: readonly unknown[], elements: readonly unknown[], ...elementsRest: readonly unknown[][]]
): any {
	if (args.length === 1) {
		const [elements] = args;

		return (array: readonly unknown[]) => prepend(array, elements);
	}

	const [array, elements, ...elementsRest] = args as [
		readonly unknown[],
		readonly unknown[],
		...readonly unknown[][],
	];

	// Use a loop if spread inputs can become large.
	return elements.concat(...elementsRest, array);
}
