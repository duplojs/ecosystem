import type * as DCommon from "@scripts/common";
import * as DArray from "@scripts/array";
import { type ReduceFromValue, type EligibleReduceFromValue, type ReduceTheFunctionParams, type ReduceExit, type ReduceNext, reduceKind } from "./reduce";

export function asyncReduce<
	GenericItem extends unknown,
	GenericReduceFrom extends EligibleReduceFromValue,
	GenericExit extends ReduceExit = ReduceExit<never>,
>(
	startValue: GenericReduceFrom,
	theFunction: (
		params: ReduceTheFunctionParams<
			GenericItem,
			ReduceFromValue<GenericReduceFrom>
		>,
	) => DCommon.MaybePromise<ReduceNext<ReduceFromValue<GenericReduceFrom>> | GenericExit>,
): (
	iterator: Iterable<GenericItem> | AsyncIterable<GenericItem>,
) => Promise<ReduceFromValue<GenericReduceFrom> | (
	DCommon.IsEqual<GenericExit, ReduceExit> extends true
		? never
		: GenericExit["-exit"]
)>;

export function asyncReduce<
	GenericItem extends unknown,
	GenericReduceFrom extends EligibleReduceFromValue,
	GenericExit extends ReduceExit = ReduceExit<never>,
>(
	iterator: Iterable<GenericItem> | AsyncIterable<GenericItem>,
	startValue: GenericReduceFrom,
	theFunction: (
		params: ReduceTheFunctionParams<
			GenericItem,
			ReduceFromValue<GenericReduceFrom>
		>,
	) => DCommon.MaybePromise<ReduceNext<ReduceFromValue<GenericReduceFrom>> | GenericExit>,
): Promise<ReduceFromValue<GenericReduceFrom> | (
	DCommon.IsEqual<GenericExit, ReduceExit> extends true
		? never
		: GenericExit["-exit"]
)>;

export function asyncReduce(
	...args:
		| [startValue: unknown, theFunction: DCommon.AnyFunction]
		| [iterator: Iterable<unknown> | AsyncIterable<unknown>, startValue: unknown, theFunction: DCommon.AnyFunction]
): any {
	if (args.length === 2) {
		const [fromValue, theFunction] = args;

		return (iterator: Iterable<unknown> | AsyncIterable<unknown>) => asyncReduce(
			iterator,
			fromValue as never,
			theFunction,
		);
	}

	const [iterator, fromValue, theFunction] = args;

	let lastValue = reduceKind.has(fromValue)
		? reduceKind.getValue(fromValue)
		: fromValue;

	return (async() => {
		let index = 0;

		for await (const item of iterator) {
			const result = await theFunction({
				item,
				index,
				lastValue,
				...DArray.reduceTools,
			}) as ReduceNext | ReduceExit;

			if ("-exit" in result) {
				return result["-exit"];
			}

			lastValue = result["-next"];

			index++;
		}

		return lastValue;
	})();
}
