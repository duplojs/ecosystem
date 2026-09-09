import { type MaxElements, type MinElements } from "./constraints";

export function chunk<
	GenericArray extends readonly unknown[],
	GenericSize extends number,
>(
	size: GenericSize,
): (
	array: GenericArray,
) => readonly (
	& readonly GenericArray[number][]
	& MinElements<1>
	& (
		number extends GenericSize
			? unknown
			: MaxElements<GenericSize>
	)
)[];

export function chunk<
	GenericArray extends readonly unknown[],
	GenericSize extends number,
>(
	array: GenericArray,
	size: GenericSize,
): readonly (
	& readonly GenericArray[number][]
	& MinElements<1>
	& (
		number extends GenericSize
			? unknown
			: MaxElements<GenericSize>
	)
)[];

export function chunk(
	...args:
		| [size: number]
		| [array: readonly unknown[], size: number]
): any {
	if (args.length === 1) {
		const [size] = args;

		return (array: readonly unknown[]) => chunk(array, size);
	}

	const [array, size] = args;

	const result = [];

	for (let index = 0; index < array.length; index += size) {
		result.push(array.slice(index, index + size));
	}

	return result;
}
