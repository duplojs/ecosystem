export function indexOf<
	GenericArray extends readonly unknown[],
>(
	element: GenericArray[number],
): (
	array: GenericArray,
) => number | undefined;

export function indexOf<
	GenericArray extends readonly unknown[],
>(
	array: GenericArray,
	element: GenericArray[number],
	fromIndex?: number,
): number | undefined;

export function indexOf(
	...args:
		| [element: unknown]
		| [array: readonly unknown[], element: unknown, fromIndex?: number]
) {
	if (args.length === 1) {
		const [element] = args;

		return (array: readonly unknown[]) => indexOf(array, element);
	}

	const [array, element, fromIndex] = args;

	// oxlint-disable-next-line no-nested-ternary
	const start = fromIndex !== undefined
		? (
			fromIndex < 0
				? Math.max(0, array.length + fromIndex)
				: Math.min(fromIndex, array.length - 1)
		)
		: 0;

	for (let index = start; index < array.length; index++) {
		if (array[index] === element) {
			return index;
		}
	}
	return undefined;
}
