import type * as DArray from "@scripts/array";

export function chunk<
	const GenericItem extends unknown,
	GenericSize extends number,
>(
	size: GenericSize,
): (
	iterator: Iterable<GenericItem>,
) => Generator<
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

export function chunk<
	const GenericItem extends unknown,
	GenericSize extends number,
>(
	iterator: Iterable<GenericItem>,
	size: GenericSize,
): Generator<
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

	return (function *() {
		let buffer: unknown[] = [];

		for (const item of iterator) {
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
