export function concat<
	const GenericItemFrom extends unknown,
	const GenericItem extends unknown,
>(
	items: Iterable<GenericItem>,
): (
	iterator: Iterable<GenericItemFrom>,
) => Generator<GenericItem | GenericItemFrom, unknown, unknown>;

export function concat<
	const GenericItemFrom extends unknown,
	const GenericItem extends unknown,
>(
	iterator: Iterable<GenericItemFrom>,
	items: Iterable<GenericItem>,
	...itemsRest: Iterable<GenericItem>[]
): Generator<GenericItem | GenericItemFrom, unknown, unknown>;

export function concat(
	...args:
		| [items: Iterable<unknown>]
		| [iterator: Iterable<unknown>, items: Iterable<unknown>, ...itemsRest: Iterable<unknown>[]]
): any {
	if (args.length === 1) {
		const [items] = args;

		return (iterator: Iterable<unknown>) => concat(iterator, items);
	}

	const [iterator, items, ...itemsRest] = args as [
		Iterable<unknown>,
		Iterable<unknown>,
		...Iterable<unknown>[],
	];

	return (function *() {
		yield *iterator;
		yield *items;

		for (const value of itemsRest) {
			yield *value;
		}
	})();
}
