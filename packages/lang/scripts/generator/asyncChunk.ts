import type * as DArray from "@scripts/array";
import * as DNumber from "@scripts/number";

type AsyncChunkOutput<
	GenericItem extends unknown,
	GenericSize extends number,
> = AsyncGenerator<
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

export function asyncChunk<
	const GenericItem extends unknown,
	GenericSize extends number,
>(
	size: GenericSize,
): (
	iterator: AsyncIterable<GenericItem>,
) => AsyncChunkOutput<GenericItem, GenericSize>;

export function asyncChunk<
	const GenericItem extends unknown,
	GenericSize extends number,
>(
	iterator: AsyncIterable<GenericItem>,
	size: GenericSize,
): AsyncChunkOutput<GenericItem, GenericSize>;

export function asyncChunk(
	...args:
		| [size: number]
		| [iterator: AsyncIterable<unknown>, size: number]
): any {
	if (args.length === 1) {
		const [size] = args;

		return (iterator: AsyncIterable<unknown>) => asyncChunk(iterator, size);
	}

	const [iterator, size] = args;
	const roundedSize = Math.round(size);

	return (async function *() {
		if (!DNumber.isStrictPositive(roundedSize)) {
			return;
		}

		let buffer: unknown[] = [];

		for await (const item of iterator) {
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
