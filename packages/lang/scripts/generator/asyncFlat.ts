import type { FlatAsyncIterator } from "./types";

export function asyncFlat<
	const GenericItem extends unknown,
	const GenericDepth extends number = 1,
>(
	iterator: AsyncIterable<GenericItem> | Iterable<GenericItem>,
	depth?: GenericDepth,
): AsyncGenerator<
	FlatAsyncIterator<GenericItem, GenericDepth>,
	void,
	unknown
>;

export async function *asyncFlat(
	iterator: AsyncIterable<unknown> | Iterable<unknown>,
	depth = 1,
): any {
	for await (const item of iterator) {
		if (
			depth >= 1
			&& item
			&& typeof item === "object"
			&& (
				Symbol.iterator in item
				|| Symbol.asyncIterator in item
			)
		) {
			yield *asyncFlat(item as never, depth - 1);
		} else {
			yield item;
		}
	}
}
