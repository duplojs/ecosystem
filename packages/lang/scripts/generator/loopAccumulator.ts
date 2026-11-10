import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import { createKind } from "./kind";
import type { LoopOutputExistResult, LoopOutputNextResult, LoopOutputValue } from "./loop";

export interface LoopAccumulatorOutputNextResult<
	GenericAccumulator extends unknown = unknown,
	GenericOutput extends unknown = unknown,
> extends LoopOutputNextResult<GenericOutput> {
	accumulator: GenericAccumulator;
}

export interface LoopAccumulatorOutputExistResult<
	GenericOutput extends unknown = unknown,
> extends LoopOutputExistResult<GenericOutput> {}

export interface LoopAccumulatorParams<
	GenericAccumulator extends unknown,
	GenericRawNextOutput extends unknown,
> {
	count: number;
	accumulator: GenericAccumulator;

	next<const GenericOutputs extends readonly (GenericRawNextOutput | undefined)[]>(
		accumulator: GenericAccumulator,
		...outputs: GenericOutputs
	): LoopAccumulatorOutputNextResult<GenericAccumulator, GenericOutputs[number]>;

	exit<const GenericOutputs extends readonly (GenericRawNextOutput | undefined)[]>(
		...outputs: GenericOutputs
	): LoopAccumulatorOutputExistResult<GenericOutputs[number]>;
}

export const loopAccumulatorKind = createKind(
	"loop-accumulator",
);

export interface LoopAccumulatorFromResult<
	GenericValue extends unknown = unknown,
> extends DKind.Kind<typeof loopAccumulatorKind, GenericValue> {}

export function loopAccumulatorFrom<
	GenericValue extends unknown,
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
	: DCommon.ToLargeEnsemble<GenericValue>;

export type LoopAccumulatorResult<
	GenericAccumulator extends unknown = unknown,
	GenericOutput extends unknown = unknown,
> = (
	| LoopAccumulatorOutputNextResult<GenericAccumulator, GenericOutput>
	| LoopAccumulatorOutputExistResult<GenericOutput>
);

export function loopAccumulator<
	GenericAccumulatorFrom extends EligibleLoopAccumulatorFromValue,
	GenericRawNextOutput extends unknown,
	GenericResult extends LoopAccumulatorResult<
		LoopAccumulatorFromValue<GenericAccumulatorFrom>,
		GenericRawNextOutput | undefined
	>,
>(
	initialAccumulator: GenericAccumulatorFrom,
	loop: (
		params: LoopAccumulatorParams<LoopAccumulatorFromValue<GenericAccumulatorFrom>, GenericRawNextOutput>,
	) => GenericResult,
): Generator<Exclude<LoopOutputValue<GenericResult>, undefined>, unknown, unknown>;

export function loopAccumulator(
	initialAccumulator: unknown,
	loop: DCommon.AnyFunction,
): any {
	return (function *() {
		let accumulator = (loopAccumulatorKind.has(initialAccumulator)
			? loopAccumulatorKind.getValue(initialAccumulator)
			: initialAccumulator);

		for (let count = 0; true; count++) {
			const result: LoopAccumulatorResult = loop({
				accumulator,
				count,
				next: (accumulator: unknown, ...outputs: unknown[]) => ({
					"-nextData": outputs,
					accumulator,
				}),
				exit: (...outputs: unknown[]) => ({ "-exitData": outputs }),
			});

			if ("-exitData" in result) {
				for (const output of result["-exitData"]) {
					if (output !== undefined) {
						yield output;
					}
				}
				break;
			}

			accumulator = result.accumulator;

			for (const output of result["-nextData"]) {
				if (output !== undefined) {
					yield output;
				}
			}
		}

		return;
	})();
}
