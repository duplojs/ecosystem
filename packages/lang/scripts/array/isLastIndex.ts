export function isLastIndex<
	GenericArray extends readonly unknown[],
>(
	index: number,
): (
	array: GenericArray,
) => boolean;

export function isLastIndex<
	GenericArray extends readonly unknown[],
>(
	array: GenericArray,
	index: number,
): boolean;

export function isLastIndex(
	...args:
		| [index: number]
		| [array: readonly unknown[], index: number]
) {
	if (args.length === 1) {
		const [index] = args;

		return (array: readonly unknown[]) => isLastIndex(array, index);
	}

	const [array, index] = args;

	return (array.length - 1) === index;
}
