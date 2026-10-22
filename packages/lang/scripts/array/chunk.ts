import * as DNumber from "@scripts/number";
import { type MaxElements, type MinElements } from "./constraints";

type ChunkOutput<
	GenericArray extends readonly unknown[],
	GenericSize extends number,
> = Extract<
	readonly (
		& readonly GenericArray[number][]
		& MinElements<1>
		& (
			DNumber.IsPositiveInteger<GenericSize> extends true
				? MaxElements<GenericSize>
				: unknown
		)
	)[],
	any
>;

export function chunk<
	GenericArray extends readonly unknown[],
	GenericSize extends number,
>(
	size: GenericSize,
): (
	array: GenericArray,
) => ChunkOutput<GenericArray, GenericSize>;

export function chunk<
	GenericArray extends readonly unknown[],
	GenericSize extends number,
>(
	array: GenericArray,
	size: GenericSize,
): ChunkOutput<GenericArray, GenericSize>;

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
	const roundedSize = Math.round(size);

	if (!DNumber.isStrictPositive(roundedSize)) {
		return [];
	}

	const result = [];

	for (let index = 0; index < array.length; index += roundedSize) {
		result.push(array.slice(index, index + roundedSize));
	}

	return result;
}
