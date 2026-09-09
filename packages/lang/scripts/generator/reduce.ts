import type * as DCommon from "@scripts/common";
import * as DArray from "@scripts/array";
import type * as DKind from "@scripts/kind";
import { createKind } from "./kind";

export interface ReduceNext<
	GenericOutput extends unknown = unknown,
> {
	"-next": GenericOutput;
}

export interface ReduceExit<
	GenericOutput extends unknown = unknown,
> {
	"-exit": GenericOutput;
}

export interface ReduceTheFunctionParams<
	GenericItem extends unknown = unknown,
	GenericOutput extends unknown = unknown,
> {
	item: GenericItem;
	index: number;
	lastValue: GenericOutput;
	nextWithObject: GenericOutput extends object
		? (
			object1: GenericOutput,
			object2: Partial<GenericOutput>,
		) => ReduceNext<GenericOutput>
		: undefined;
	next(output: GenericOutput): ReduceNext<GenericOutput>;
	exit<
		GenericExitValue extends unknown,
	>(output: GenericExitValue): ReduceExit<GenericExitValue>;
	nextPush: GenericOutput extends readonly any[]
		? (
			array: GenericOutput,
			...values: GenericOutput
		) => ReduceNext<GenericOutput>
		: undefined;
}

export const reduceKind = createKind(
	"reduce",
);

export interface ReduceFromResult<
	GenericValue extends unknown = unknown,
> extends DKind.Kind<typeof reduceKind, GenericValue> {}

export function reduceFrom<
	GenericValue extends unknown,
>(
	value: GenericValue,
): ReduceFromResult<GenericValue> {
	return {
		[reduceKind.runTimeKey]: value,
	} as never;
}

export type EligibleReduceFromValue = number | string | bigint | boolean | ReduceFromResult;

export type ReduceFromValue<
	GenericValue extends EligibleReduceFromValue,
> = GenericValue extends ReduceFromResult<infer InferredValue>
	? InferredValue
	: DCommon.ToLargeEnsemble<GenericValue>;

export function reduce<
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
	) => ReduceNext<ReduceFromValue<GenericReduceFrom>> | GenericExit,
): (
	iterator: Iterable<GenericItem>,
) => ReduceFromValue<GenericReduceFrom> | (
	DCommon.IsEqual<GenericExit, ReduceExit> extends true
		? never
		: GenericExit["-exit"]
);

export function reduce<
	GenericItem extends unknown,
	GenericReduceFrom extends EligibleReduceFromValue,
	GenericExit extends ReduceExit = ReduceExit<never>,
>(
	iterator: Iterable<GenericItem>,
	startValue: GenericReduceFrom,
	theFunction: (
		params: ReduceTheFunctionParams<
			GenericItem,
			ReduceFromValue<GenericReduceFrom>
		>,
	) => ReduceNext<ReduceFromValue<GenericReduceFrom>> | GenericExit,
): ReduceFromValue<GenericReduceFrom> | (
	DCommon.IsEqual<GenericExit, ReduceExit> extends true
		? never
		: GenericExit["-exit"]
);

export function reduce(
	...args:
		| [startValue: unknown, theFunction: DCommon.AnyFunction]
		| [iterator: Iterable<unknown>, startValue: unknown, theFunction: DCommon.AnyFunction]
): any {
	if (args.length === 2) {
		const [fromValue, theFunction] = args;

		return (iterator: Iterable<unknown>) => reduce(
			iterator,
			fromValue as never,
			theFunction,
		);
	}

	const [iterator, fromValue, theFunction] = args;

	let lastValue = reduceKind.has(fromValue)
		? reduceKind.getValue(fromValue)
		: fromValue;

	let index = 0;

	for (const item of iterator) {
		const result = theFunction({
			item,
			index,
			lastValue,
			...DArray.reduceTools,
		}) as ReduceExit | ReduceNext;

		if ("-exit" in result) {
			return result["-exit"];
		}

		lastValue = result["-next"];

		index++;
	}

	return lastValue;
}
