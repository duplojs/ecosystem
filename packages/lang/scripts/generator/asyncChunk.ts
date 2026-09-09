import type * as DArray from "@scripts/array";

export function asyncChunk<
	const GenericItem extends unknown,
	GenericSize extends number,
>(
	size: GenericSize,
): (
	iterator: AsyncIterable<GenericItem>,
) => AsyncGenerator<
	& readonly GenericItem[]
	& DArray.MinElements<1>
	& (
		number extends GenericSize
			? unknown
			: DArray.MaxElements<GenericSize>
	),
	unknown,
	unknown
>;

export function asyncChunk<
	const GenericItem extends unknown,
	GenericSize extends number,
>(
	iterator: AsyncIterable<GenericItem>,
	size: GenericSize,
): AsyncGenerator<
	& readonly GenericItem[]
	& DArray.MinElements<1>
	& (
		number extends GenericSize
			? unknown
			: DArray.MaxElements<GenericSize>
	),
	unknown,
	unknown
>;

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

	return (async function *() {
		let buffer: unknown[] = [];

		for await (const item of iterator) {
			buffer.push(item);

			if (buffer.length === size) {
				yield buffer;
				buffer = [];
			}
		}

		if (buffer.length > 0) {
			yield buffer;
		}
	})();
}
