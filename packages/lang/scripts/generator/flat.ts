import type { FlatIterator } from "./types";

export function flat<
	const GenericItem extends unknown,
	const GenericDepth extends number = 1,
>(
	iterator: Iterable<GenericItem>,
	depth?: GenericDepth,
): Generator<
	FlatIterator<GenericItem, GenericDepth>,
	void,
	unknown
>;

export function *flat(
	iterator: Iterable<unknown>,
	depth = 1,
): any {
	for (const item of iterator) {
		if (
			depth >= 1
			&& item
			&& typeof item === "object"
			&& Symbol.iterator in item
		) {
			yield *flat(item as never, depth - 1);
		} else {
			yield item;
		}
	}
}
