import type * as DArray from "@scripts/array";
import * as DNumber from "@scripts/number";

type ChunkOutput<
	GenericItem extends unknown,
	GenericSize extends number,
> = Generator<
	& readonly GenericItem[]
	& DArray.MinElements<1>
	& (
		DNumber.IsPositiveInteger<GenericSize> extends true
			? DArray.MaxElements<GenericSize>
			: unknown
	),
	unknown,
	unknown
>;

export function chunk<
	const GenericItem extends unknown,
	GenericSize extends number,
>(
	size: GenericSize,
): (
	iterator: Iterable<GenericItem>,
) => ChunkOutput<GenericItem, GenericSize>;

export function chunk<
	const GenericItem extends unknown,
	GenericSize extends number,
>(
	iterator: Iterable<GenericItem>,
	size: GenericSize,
): ChunkOutput<GenericItem, GenericSize>;

export function chunk(
	...args:
		| [size: number]
		| [iterator: Iterable<unknown>, size: number]
): any {
	if (args.length === 1) {
		const [size] = args;

		return (iterator: Iterable<unknown>) => chunk(iterator, size);
	}

	const [iterator, size] = args;
	const roundedSize = Math.round(size);

	return (function *() {
		if (!DNumber.isStrictPositive(roundedSize)) {
			return;
		}

		let buffer: unknown[] = [];

		for (const item of iterator) {
			buffer.push(item);

			if (buffer.length === roundedSize) {
				yield buffer;
				buffer = [];
			}
		}

		if (buffer.length > 0) {
			yield buffer;
		}
	})();
}
