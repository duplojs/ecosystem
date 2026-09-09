import type * as DCommon from "@scripts/common";
import { type ReduceTheFunctionParams, type ReduceFromValue, type ReduceExit, type ReduceNext, reduceTools, type EligibleReduceFromValue, reduceKind } from "./reduce";

export function reduceRight<
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

export function reduceRight<
	GenericArray extends readonly unknown[],
	GenericReduceFrom extends EligibleReduceFromValue,
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

export function reduceRight(
	...args:
		| [fromValue: unknown, theFunction: DCommon.AnyFunction]
		| [array: readonly unknown[], fromValue: unknown, theFunction: DCommon.AnyFunction]
): any {
	if (args.length === 2) {
		const [fromValue, theFunction] = args;

		return (input: readonly unknown[]) => reduceRight(
			input,
			fromValue as never,
			theFunction as never,
		);
	}

	const [input, fromValue, theFunction] = args;

	let lastValue = reduceKind.has(fromValue)
		? reduceKind.getValue(fromValue)
		: fromValue;

	for (let index = input.length - 1; index >= 0; index--) {
		const element = input[index]!;

		const result = theFunction({
			element,
			index,
			lastValue,
			self: input,
			...reduceTools,
		}) as ReduceExit | ReduceNext;

		if ("-exit" in result) {
			return result["-exit"];
		}

		lastValue = result["-next"];
	}

	return lastValue;
}
