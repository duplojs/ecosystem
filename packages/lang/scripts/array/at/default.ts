import type { IsIndexCovered, IsIndexOutOfRange } from "../constraints";

export type At<
	GenericArray extends readonly unknown[],
	GenericIndex extends number,
> = GenericArray extends unknown
	? IsIndexOutOfRange<GenericArray, GenericIndex> extends true
		? undefined
		: IsIndexCovered<GenericArray, GenericIndex> extends true
			? GenericArray[number]
			: GenericArray[number] | undefined
	: never;

export function at<
	GenericArray extends readonly unknown[],
	GenericIndex extends number,
>(
	index: GenericIndex,
): (
	array: GenericArray,
) => At<GenericArray, GenericIndex>;

export function at<
	GenericArray extends readonly unknown[],
	GenericIndex extends number,
>(
	array: GenericArray,
	index: GenericIndex,
): At<GenericArray, GenericIndex>;

export function at(
	...args:
		| [array: readonly unknown[], index: number]
		| [index: number]
) {
	if (args.length === 1) {
		const [index] = args;

		return (array: readonly unknown[]) => at(array, index);
	}

	const [input, index] = args;

	return input.at(index);
}
