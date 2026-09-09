import type * as DKind from "@scripts/kind";
import type * as DCommon from "@scripts/common";
import * as DObject from "@scripts/object";
import { push } from "./push";
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
	GenericArray extends readonly unknown[] = unknown[],
	GenericOutput extends unknown = unknown,
> {
	element: GenericArray[number];
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
	self: GenericArray;
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
>(value: GenericValue): ReduceFromResult<GenericValue> {
	return {
		[reduceKind.runTimeKey]: value,
	} as never;
}

export const reduceTools: Pick<
	ReduceTheFunctionParams<any, any>,
	"exit" | "next" | "nextWithObject" | "nextPush"
> = {
	exit(output: any) {
		return { "-exit": output };
	},
	next(output: any) {
		return { "-next": output };
	},
	nextWithObject(object1: object, object2: object) {
		return { "-next": DObject.override(object1, object2) };
	},
	nextPush(
		array: readonly unknown[],
		...[value, ...values]: [unknown, ...unknown[]]
	) {
		return { "-next": push(array, value, ...values) };
	},
};

export type EligibleReduceFromValue = number | string | bigint | boolean | ReduceFromResult;

export type ReduceFromValue<
	GenericValue extends EligibleReduceFromValue,
> = GenericValue extends ReduceFromResult<infer InferredValue>
	? InferredValue
	: DCommon.ToLargeEnsemble<GenericValue>;

export function reduce<
	GenericArray extends readonly unknown[],
	GenericReduceFrom extends EligibleReduceFromValue,
	GenericExit extends ReduceExit = ReduceExit<never>,
>(
	fromValue: GenericReduceFrom,
	theFunction: (
		params: ReduceTheFunctionParams<
			GenericArray,
			ReduceFromValue<GenericReduceFrom>
		>,
	) => ReduceNext<ReduceFromValue<GenericReduceFrom>> | GenericExit,
): (
	array: GenericArray,
) => ReduceFromValue<GenericReduceFrom> | (
	DCommon.IsEqual<GenericExit, ReduceExit> extends true
		? never
		: GenericExit["-exit"]
);

export function reduce<
	GenericArray extends readonly unknown[],
	GenericReduceFrom extends number | string | bigint | boolean | ReduceFromResult,
	GenericExit extends ReduceExit = ReduceExit<never>,
>(
	array: GenericArray,
	fromValue: GenericReduceFrom,
	theFunction: (
		params: ReduceTheFunctionParams<
			GenericArray,
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
		| [fromValue: unknown, theFunction: DCommon.AnyFunction]
		| [array: readonly unknown[], fromValue: unknown, theFunction: DCommon.AnyFunction]
): any {
	if (args.length === 2) {
		const [fromValue, theFunction] = args;

		return (array: readonly unknown[]) => reduce(
			array,
			fromValue as never,
			theFunction as never,
		);
	}

	const [array, fromValue, theFunction] = args;

	let lastValue = reduceKind.has(fromValue)
		? reduceKind.getValue(fromValue)
		: fromValue;

	for (let index = 0; index < array.length; index++) {
		const element = array[index]!;

		const result = theFunction({
			element,
			index,
			lastValue,
			self: array,
			...reduceTools,
		}) as ReduceExit | ReduceNext;

		if ("-exit" in result) {
			return result["-exit"];
		}

		lastValue = result["-next"];
	}

	return lastValue;
}
