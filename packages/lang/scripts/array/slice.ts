export function slice<
	GenericArray extends readonly unknown[],
>(
	start?: number,
	end?: number,
): (
	array: GenericArray,
) => GenericArray[number][];

export function slice<
	GenericArray extends readonly unknown[],
>(
	array: GenericArray,
	start?: number,
	end?: number,
): GenericArray[number][];

export function slice(
	...args:
		| [array: readonly unknown[], start?: number, end?: number]
		| [start?: number, end?: number]
) {
	if (!Array.isArray(args[0])) {
		const [start, end] = args as [start?: number, end?: number];

		return (array: readonly unknown[]) => slice(array, start, end);
	}

	const [array, start, end] = args;

	return array.slice(start, end);
}
