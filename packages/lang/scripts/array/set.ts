export function set<
	GenericArray extends readonly unknown[],
	const GenericValue extends unknown,
>(
	index: number,
	value: GenericValue,
): (
	array: GenericArray,
) => (
	| GenericArray[number]
	| GenericValue
)[];

export function set<
	GenericArray extends readonly unknown[],
	const GenericValue extends unknown,
>(
	array: GenericArray,
	index: number,
	value: GenericValue,
): (
	| GenericArray[number]
	| GenericValue
)[];

export function set(
	...args:
		| [index: number, value: unknown]
		| [array: readonly unknown[], index: number, value: unknown]
) {
	if (args.length === 2) {
		const [index, value] = args;

		return (array: readonly unknown[]) => set(array, index, value);
	}

	const [array, index, value] = args;

	const length = array.length;
	const modIndex = ((index % length) + length) % length;

	return array.with(modIndex, value);
}
