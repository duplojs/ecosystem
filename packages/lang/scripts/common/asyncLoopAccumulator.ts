import type { AnyFunction, AnyValue } from "./types";
import { type EligibleLoopAccumulatorFromValue, type LoopAccumulatorFromValue, type LoopAccumulatorParams, loopAccumulatorKind } from "./loopAccumulator";

interface AsyncLoopAccumulatorOutputNextResult<
	GenericAccumulator extends AnyValue,
> {
	"-nextData": GenericAccumulator;
}

interface AsyncLoopAccumulatorOutputExitResult<
	GenericOutput extends AnyValue,
> {
	"-exitData": GenericOutput;
}

type AsyncLoopAccumulatorResult<
	GenericAccumulator extends AnyValue,
	GenericExitOutput extends AnyValue,
> = AsyncLoopAccumulatorOutputNextResult<GenericAccumulator> | AsyncLoopAccumulatorOutputExitResult<GenericExitOutput>;

export function asyncLoopAccumulator<
	GenericAccumulatorFrom extends EligibleLoopAccumulatorFromValue,
	GenericExitOutput extends AnyValue = undefined,
>(
	initialAccumulator: GenericAccumulatorFrom,
	callback: (
		params: LoopAccumulatorParams<LoopAccumulatorFromValue<GenericAccumulatorFrom>>,
	) => Promise<AsyncLoopAccumulatorResult<LoopAccumulatorFromValue<GenericAccumulatorFrom>, GenericExitOutput>>,
): Promise<GenericExitOutput>;

export async function asyncLoopAccumulator(
	initialAccumulator: AnyValue,
	callback: AnyFunction,
): Promise<AnyValue> {
	let accumulator = loopAccumulatorKind.has(initialAccumulator)
		? loopAccumulatorKind.getValue(initialAccumulator)
		: initialAccumulator;

	for (let count = 0; true; count++) {
		const result = await callback({
			accumulator,
			count,
			next: (nextAccumulator: AnyValue) => ({ "-nextData": nextAccumulator }),
			exit: (output: AnyValue) => ({ "-exitData": output }),
		}) as (
			| AsyncLoopAccumulatorOutputNextResult<any>
			| AsyncLoopAccumulatorOutputExitResult<any>
		);

		if ("-exitData" in result) {
			return result["-exitData"];
		}

		accumulator = result["-nextData"];
	}
}
