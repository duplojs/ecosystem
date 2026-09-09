import type * as DCommon from "@scripts/common";

export interface AsyncFilterParams {
	index: number;
}

export function asyncFilter<
	const GenericItem extends unknown,
	const GenericOutput extends GenericItem,
>(
	predicate: (
		item: GenericItem,
		params: AsyncFilterParams,
	) => item is GenericOutput,
): (
	iterator: Iterable<GenericItem> | AsyncIterable<GenericItem>,
) => AsyncGenerator<GenericOutput, unknown, unknown>;

export function asyncFilter<
	const GenericItem extends unknown,
	const GenericOutput extends GenericItem,
>(
	iterator: Iterable<GenericItem> | AsyncIterable<GenericItem>,
	predicate: (
		item: GenericItem,
		params: AsyncFilterParams,
	) => item is GenericOutput,
): AsyncGenerator<GenericOutput, unknown, unknown>;

export function asyncFilter<
	const GenericItem extends unknown,
>(
	predicate: (
		item: GenericItem,
		params: AsyncFilterParams,
	) => boolean,
): (
	iterator: Iterable<GenericItem> | AsyncIterable<GenericItem>,
) => AsyncGenerator<GenericItem, unknown, unknown>;

export function asyncFilter<
	const GenericItem extends unknown,
>(
	iterator: Iterable<GenericItem> | AsyncIterable<GenericItem>,
	predicate: (
		item: GenericItem,
		params: AsyncFilterParams,
	) => boolean,
): AsyncGenerator<GenericItem, unknown, unknown>;

export function asyncFilter(
	...args:
		| [predicate: DCommon.AnyFunction]
		| [iterator: Iterable<unknown> | AsyncIterable<unknown>, predicate: DCommon.AnyFunction]
): any {
	if (args.length === 1) {
		const [predicate] = args;

		return (iterator: Iterable<unknown> | AsyncIterable<unknown>) => asyncFilter(iterator, predicate);
	}

	const [iterator, predicate] = args;

	let index = 0;

	return (async function *() {
		for await (const item of iterator) {
			if (predicate(item, { index })) {
				yield item;
			}
			index++;
		}
	})();
}
