import type * as DCommon from "@scripts/common";

export interface MapTheFunctionParams<
	GenericItem extends unknown = unknown,
> {
	index: number;
	self: Iterable<GenericItem>;
}

export function map<
	const GenericItem extends unknown,
	const GenericOutput extends unknown,
>(
	theFunction: (
		item: GenericItem,
		params: MapTheFunctionParams<GenericItem>,
	) => GenericOutput,
): (
	iterator: Iterable<GenericItem>,
) => Generator<GenericOutput, unknown, unknown>;

export function map<
	const GenericItem extends unknown,
	const GenericOutput extends unknown,
>(
	iterator: Iterable<GenericItem>,
	theFunction: (
		item: GenericItem,
		params: MapTheFunctionParams<GenericItem>,
	) => GenericOutput,
): Generator<GenericOutput, unknown, unknown>;

export function map(
	...args:
		| [theFunction: DCommon.AnyFunction]
		| [iterator: Iterable<unknown>, theFunction: DCommon.AnyFunction]
): any {
	if (args.length === 1) {
		const [theFunction] = args;

		return (iterator: Iterable<unknown>) => map(iterator, theFunction);
	}

	const [iterator, theFunction] = args;

	let index = 0;

	return (function *() {
		for (const item of iterator) {
			yield theFunction(
				item,
				{
					index,
					self: iterator,
				},
			);
			index++;
		}
	})();
}
