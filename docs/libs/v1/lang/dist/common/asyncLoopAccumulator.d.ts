import { AnyValue } from './types';
import { EligibleLoopAccumulatorFromValue, LoopAccumulatorFromValue, LoopAccumulatorParams } from './loopAccumulator';
interface AsyncLoopAccumulatorOutputNextResult<GenericAccumulator extends AnyValue> {
    "-nextData": GenericAccumulator;
}
interface AsyncLoopAccumulatorOutputExitResult<GenericOutput extends AnyValue> {
    "-exitData": GenericOutput;
}
type AsyncLoopAccumulatorResult<GenericAccumulator extends AnyValue, GenericExitOutput extends AnyValue> = AsyncLoopAccumulatorOutputNextResult<GenericAccumulator> | AsyncLoopAccumulatorOutputExitResult<GenericExitOutput>;
export declare function asyncLoopAccumulator<GenericAccumulatorFrom extends EligibleLoopAccumulatorFromValue, GenericExitOutput extends AnyValue = undefined>(initialAccumulator: GenericAccumulatorFrom, callback: (params: LoopAccumulatorParams<LoopAccumulatorFromValue<GenericAccumulatorFrom>>) => Promise<AsyncLoopAccumulatorResult<LoopAccumulatorFromValue<GenericAccumulatorFrom>, GenericExitOutput>>): Promise<GenericExitOutput>;
export {};
