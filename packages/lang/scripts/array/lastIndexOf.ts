export function lastIndexOf<
	GenericArray extends readonly unknown[],
>(
	element: GenericArray[number],
): (
	array: GenericArray,
) => number | undefined;

export function lastIndexOf<
	GenericArray extends readonly unknown[],
>(
	array: GenericArray,
	element: GenericArray[number],
	fromIndex?: number,
): number | undefined;

export function lastIndexOf(
	...args:
		| [element: unknown]
		| [array: readonly unknown[], element: unknown, fromIndex?: number]
) {
	if (args.length === 1) {
		const [element] = args;

		return (array: readonly unknown[]) => lastIndexOf(array, element);
	}

	const [array, element, fromIndex] = args;

	// oxlint-disable-next-line no-nested-ternary
	const startIndex = fromIndex !== undefined
		? (
			fromIndex < 0
				? Math.max(0, array.length + fromIndex)
				: Math.min(fromIndex, array.length - 1)
		)
		: array.length - 1;

	for (let index = startIndex; index >= 0; index--) {
		if (array[index] === element) {
			return index;
		}
	}

	return undefined;
}
