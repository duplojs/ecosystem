import type * as DCommon from "@scripts/common";

export interface AsyncMapParams {
	index: number;
}

export function asyncMap<
	const GenericItem extends unknown,
	const GenericOutput extends unknown,
>(
	theFunction: (
		item: GenericItem,
		params: AsyncMapParams,
	) => GenericOutput,
): (
	iterator: AsyncIterable<GenericItem> | Iterable<GenericItem>,
) => AsyncGenerator<
	Awaited<GenericOutput>,
	unknown,
	unknown
>;

export function asyncMap<
	const GenericItem extends unknown,
	const GenericOutput extends unknown,
>(
	iterator: AsyncIterable<GenericItem> | Iterable<GenericItem>,
	theFunction: (
		item: GenericItem,
		params: AsyncMapParams,
	) => GenericOutput,
): AsyncGenerator<
	Awaited<GenericOutput>,
	unknown,
	unknown
>;

export function asyncMap(
	...args:
		| [theFunction: DCommon.AnyFunction]
		| [iterator: AsyncIterable<unknown> | Iterable<unknown>, theFunction: DCommon.AnyFunction]
): any {
	if (args.length === 1) {
		const [theFunction] = args;

		return (iterator: AsyncIterable<unknown>) => asyncMap(iterator, theFunction);
	}

	const [iterator, theFunction] = args;

	let index = 0;

	return (async function *() {
		for await (const item of iterator) {
			yield await theFunction(item, { index });
			index++;
		}
	})();
}
