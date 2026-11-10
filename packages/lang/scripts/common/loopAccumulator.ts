import type { AnyFunction, AnyValue, ToLargeEnsemble } from "./types";
import type * as DKind from "@scripts/kind";
import { createKind } from "./kind";

interface LoopAccumulatorOutputNextResult<
	GenericAccumulator extends AnyValue,
> {
	"-nextData": GenericAccumulator;
}

interface LoopAccumulatorOutputExitResult<
	GenericOutput extends AnyValue,
> {
	"-exitData": GenericOutput;
}

export interface LoopAccumulatorParams<
	GenericAccumulator extends AnyValue,
> {
	count: number;
	accumulator: GenericAccumulator;
	next<
		GenericNextAccumulator extends GenericAccumulator,
	>(accumulator: GenericNextAccumulator): LoopAccumulatorOutputNextResult<GenericNextAccumulator>;
	exit<
		GenericOutput extends AnyValue = undefined,
	>(output?: GenericOutput): LoopAccumulatorOutputExitResult<GenericOutput>;
}

export const loopAccumulatorKind = createKind("loop-accumulator");

export interface LoopAccumulatorFromResult<
	GenericValue extends AnyValue = AnyValue,
> extends DKind.Kind<typeof loopAccumulatorKind, GenericValue> {}

export function loopAccumulatorFrom<
	GenericValue extends AnyValue,
>(
	value: GenericValue,
): LoopAccumulatorFromResult<GenericValue> {
	return {
		[loopAccumulatorKind.runTimeKey]: value,
	} as never;
}

export type EligibleLoopAccumulatorFromValue = number | string | bigint | boolean | LoopAccumulatorFromResult;

export type LoopAccumulatorFromValue<
	GenericValue extends EligibleLoopAccumulatorFromValue,
> = GenericValue extends LoopAccumulatorFromResult<infer InferredValue>
	? InferredValue
	: ToLargeEnsemble<GenericValue>;

type LoopAccumulatorResult<
	GenericAccumulator extends AnyValue,
	GenericExitOutput extends AnyValue,
> = LoopAccumulatorOutputNextResult<GenericAccumulator> | LoopAccumulatorOutputExitResult<GenericExitOutput>;

export function loopAccumulator<
	GenericAccumulatorFrom extends EligibleLoopAccumulatorFromValue,
	GenericExitOutput extends AnyValue = undefined,
>(
	initialAccumulator: GenericAccumulatorFrom,
	callback: (
		params: LoopAccumulatorParams<LoopAccumulatorFromValue<GenericAccumulatorFrom>>,
	) => LoopAccumulatorResult<LoopAccumulatorFromValue<GenericAccumulatorFrom>, GenericExitOutput>,
): GenericExitOutput;

export function loopAccumulator(
	initialAccumulator: AnyValue,
	callback: AnyFunction,
): any {
	let accumulator = loopAccumulatorKind.has(initialAccumulator)
		? loopAccumulatorKind.getValue(initialAccumulator)
		: initialAccumulator;

	for (let count = 0; true; count++) {
		const result = callback({
			accumulator,
			count,
			next: (nextAccumulator: AnyValue) => ({ "-nextData": nextAccumulator }),
			exit: (output: AnyValue) => ({ "-exitData": output }),
		}) as (
			| LoopAccumulatorOutputExitResult<any>
			| LoopAccumulatorOutputNextResult<any>
		);

		if ("-exitData" in result) {
			return result["-exitData"];
		}

		accumulator = result["-nextData"];
	}
}
