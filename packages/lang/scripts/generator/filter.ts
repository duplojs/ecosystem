import type * as DCommon from "@scripts/common";

export interface FilterParams<
	GenericItem extends unknown = unknown,
> {
	index: number;
	self: Iterable<GenericItem>;
}

export function filter<
	const GenericItem extends unknown,
	const GenericOutput extends GenericItem,
>(
	predicate: (
		item: GenericItem,
		params: FilterParams<GenericItem>,
	) => item is GenericOutput,
): (
	iterator: Iterable<GenericItem>,
) => Generator<GenericOutput, unknown, unknown>;

export function filter<
	const GenericItem extends unknown,
	const GenericOutput extends GenericItem,
>(
	iterator: Iterable<GenericItem>,
	predicate: (
		item: GenericItem,
		params: FilterParams<GenericItem>,
	) => item is GenericOutput,
): Generator<GenericOutput, unknown, unknown>;

export function filter<
	const GenericItem extends unknown,
>(
	predicate: (
		item: GenericItem,
		params: FilterParams<GenericItem>,
	) => boolean,
): (
	iterator: Iterable<GenericItem>,
) => Generator<GenericItem, unknown, unknown>;

export function filter<
	const GenericItem extends unknown,
>(
	iterator: Iterable<GenericItem>,
	predicate: (
		item: GenericItem,
		params: FilterParams<GenericItem>,
	) => boolean,
): Generator<GenericItem, unknown, unknown>;

export function filter(
	...args:
		| [predicate: DCommon.AnyFunction]
		| [iterator: Iterable<unknown>, predicate: DCommon.AnyFunction]
): any {
	if (args.length === 1) {
		const [predicate] = args;

		return (iterator: Iterable<unknown>) => filter(iterator, predicate);
	}

	const [iterator, predicate] = args;

	let index = 0;

	return (function *() {
		for (const item of iterator) {
			if (
				predicate(
					item,
					{
						index,
						self: iterator,
					},
				)
			) {
				yield item;
			}
			index++;
		}
	})();
}
