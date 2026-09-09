export function notIncludes<
	GenericArray extends readonly unknown[],
	GenericValue extends GenericArray[number],
>(
	value: GenericValue,
): (
	array: GenericArray,
) => boolean;

export function notIncludes<
	GenericArray extends readonly unknown[],
	GenericValue extends GenericArray[number],
>(
	array: GenericArray,
	value: GenericValue,
): boolean;

export function notIncludes(
	...args:
		| [value: unknown]
		| [array: readonly unknown[], value: unknown]
) {
	if (args.length === 1) {
		const [value] = args;

		return (array: readonly unknown[]) => notIncludes(array, value);
	}

	const [array, value] = args;

	return !array.includes(value);
}
