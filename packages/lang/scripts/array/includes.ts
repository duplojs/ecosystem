export function includes<
	GenericArray extends readonly unknown[],
	GenericValue extends GenericArray[number],
>(
	value: GenericValue,
): (
	array: GenericArray,
) => boolean;

export function includes<
	GenericArray extends readonly unknown[],
	GenericValue extends GenericArray[number],
>(
	array: GenericArray,
	value: GenericValue,
): boolean;

export function includes(
	...args:
		| [value: unknown]
		| [array: readonly unknown[], value: unknown]
) {
	if (args.length === 1) {
		const [value] = args;

		return (array: readonly unknown[]) => includes(array, value);
	}

	const [array, value] = args;

	return array.includes(value);
}
