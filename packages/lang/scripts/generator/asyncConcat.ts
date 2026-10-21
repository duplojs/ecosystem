export function asyncConcat<
	const GenericItemFrom extends unknown,
	const GenericItem extends unknown,
>(
	items: AsyncIterable<GenericItem> | Iterable<GenericItem>,
): (
	iterator: AsyncIterable<GenericItemFrom> | Iterable<GenericItemFrom>,
) => AsyncGenerator<GenericItem | GenericItemFrom, unknown, unknown>;

export function asyncConcat<
	const GenericItemFrom extends unknown,
	const GenericItem extends unknown,
>(
	iterator: AsyncIterable<GenericItemFrom> | Iterable<GenericItemFrom>,
	items: AsyncIterable<GenericItem> | Iterable<GenericItem>,
	...itemsRest: (AsyncIterable<GenericItem> | Iterable<GenericItem>)[]
): AsyncGenerator<GenericItem | GenericItemFrom, unknown, unknown>;

export function asyncConcat(
	...args:
		| [
			AsyncIterable<unknown> | Iterable<unknown>,
			AsyncIterable<unknown> | Iterable<unknown>,
			...(AsyncIterable<unknown> | Iterable<unknown>)[],
		]
		| [AsyncIterable<unknown> | Iterable<unknown>]
): any {
	if (args.length === 1) {
		const [items] = args;

		return (
			iterator: AsyncIterable<unknown> | Iterable<unknown>,
		) => asyncConcat(iterator, items);
	}

	const [iterator, items, ...itemsRest] = args as [
		AsyncIterable<unknown> | Iterable<unknown>,
		AsyncIterable<unknown> | Iterable<unknown>,
		...(AsyncIterable<unknown> | Iterable<unknown>)[],
	];

	return (async function *() {
		yield *iterator;
		yield *items;

		for (const value of itemsRest) {
			yield *value;
		}
	})();
}
