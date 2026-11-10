import type * as DCommon from "@scripts/common";
import type { LoopOutputValue } from "./loop";
import { type EligibleLoopAccumulatorFromValue, type LoopAccumulatorFromValue, type LoopAccumulatorParams, type LoopAccumulatorResult, loopAccumulatorKind } from "./loopAccumulator";

export interface AsyncLoopAccumulatorParams<
	GenericAccumulator extends unknown,
	GenericOutput extends unknown,
> extends LoopAccumulatorParams<GenericAccumulator, DCommon.MaybePromise<GenericOutput | undefined>> {}

export function asyncLoopAccumulator<
	GenericAccumulatorFrom extends EligibleLoopAccumulatorFromValue,
	GenericRawNextOutput extends unknown,
	GenericResult extends DCommon.MaybePromise<LoopAccumulatorResult<
		LoopAccumulatorFromValue<GenericAccumulatorFrom>,
		DCommon.MaybePromise<GenericRawNextOutput | undefined>
	>>,
>(
	initialAccumulator: GenericAccumulatorFrom,
	loop: (
		params: AsyncLoopAccumulatorParams<LoopAccumulatorFromValue<GenericAccumulatorFrom>, GenericRawNextOutput>,
	) => GenericResult,
): AsyncGenerator<Exclude<Awaited<LoopOutputValue<Awaited<GenericResult>>>, undefined>, unknown, unknown>;

export function asyncLoopAccumulator(
	initialAccumulator: unknown,
	loop: DCommon.AnyFunction,
): any {
	return (async function *() {
		let accumulator = (loopAccumulatorKind.has(initialAccumulator)
			? loopAccumulatorKind.getValue(initialAccumulator)
			: initialAccumulator);

		for (let count = 0; true; count++) {
			const result: LoopAccumulatorResult = await loop({
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
					const resolvedOutput = await output;
					if (resolvedOutput !== undefined) {
						yield resolvedOutput;
					}
				}
				break;
			}

			accumulator = result.accumulator;

			for (const output of result["-nextData"]) {
				const resolvedOutput = await output;
				if (resolvedOutput !== undefined) {
					yield resolvedOutput;
				}
			}
		}

		return;
	})();
}
