import type { ReapplyCompatiblesConstraints } from "./constraints";

type ConcatOutput<
	GenericArray extends readonly unknown[],
	GenericElements extends readonly unknown[],
	GenericElementsRest extends readonly unknown[][] = [],
> = GenericArray extends unknown
	? ReapplyCompatiblesConstraints<
		GenericArray,
		readonly (
			| GenericArray[number]
			| GenericElements[number]
			| GenericElementsRest[number][number]
		)[],
		"minElements"
	>
	: never;

export function concat<
	GenericArray extends readonly unknown[],
	GenericElements extends readonly unknown[],
>(
	elements: GenericElements,
): (
	array: GenericArray,
) => ConcatOutput<GenericArray, GenericElements>;

export function concat<
	GenericArray extends readonly unknown[],
	GenericElements extends readonly unknown[],
	GenericElementsRest extends readonly unknown[][],
>(
	array: GenericArray,
	elements: GenericElements,
	...elementsRest: GenericElementsRest
): ConcatOutput<GenericArray, GenericElements, GenericElementsRest>;

export function concat(
	...args:
		| [elements: readonly unknown[]]
		| [array: readonly unknown[], elements: readonly unknown[], ...elementsRest: readonly unknown[]]
): any {
	if (args.length === 1) {
		const [elements] = args;

		return (array: readonly unknown[]) => concat(array, elements);
	}

	const [array, elements, ...elementsRest] = args;

	// Use a loop if spread inputs can become large.
	return array.concat(elements, ...elementsRest);
}
