import { AnyValue, ToLargeEnsemble } from './types';
import type * as DKind from '../kind';
interface LoopAccumulatorOutputNextResult<GenericAccumulator extends AnyValue> {
    "-nextData": GenericAccumulator;
}
interface LoopAccumulatorOutputExitResult<GenericOutput extends AnyValue> {
    "-exitData": GenericOutput;
}
export interface LoopAccumulatorParams<GenericAccumulator extends AnyValue> {
    count: number;
    accumulator: GenericAccumulator;
    next<GenericNextAccumulator extends GenericAccumulator>(accumulator: GenericNextAccumulator): LoopAccumulatorOutputNextResult<GenericNextAccumulator>;
    exit<GenericOutput extends AnyValue = undefined>(output?: GenericOutput): LoopAccumulatorOutputExitResult<GenericOutput>;
}
export declare const loopAccumulatorKind: DKind.Handler<DKind.Definition<"@DuplojsLangCommon/loop-accumulator", unknown>>;
export interface LoopAccumulatorFromResult<GenericValue extends AnyValue = AnyValue> extends DKind.Kind<typeof loopAccumulatorKind, GenericValue> {
}
export declare function loopAccumulatorFrom<GenericValue extends AnyValue>(value: GenericValue): LoopAccumulatorFromResult<GenericValue>;
export type EligibleLoopAccumulatorFromValue = number | string | bigint | boolean | LoopAccumulatorFromResult;
export type LoopAccumulatorFromValue<GenericValue extends EligibleLoopAccumulatorFromValue> = GenericValue extends LoopAccumulatorFromResult<infer InferredValue> ? InferredValue : ToLargeEnsemble<GenericValue>;
type LoopAccumulatorResult<GenericAccumulator extends AnyValue, GenericExitOutput extends AnyValue> = LoopAccumulatorOutputNextResult<GenericAccumulator> | LoopAccumulatorOutputExitResult<GenericExitOutput>;
export declare function loopAccumulator<GenericAccumulatorFrom extends EligibleLoopAccumulatorFromValue, GenericExitOutput extends AnyValue = undefined>(initialAccumulator: GenericAccumulatorFrom, callback: (params: LoopAccumulatorParams<LoopAccumulatorFromValue<GenericAccumulatorFrom>>) => LoopAccumulatorResult<LoopAccumulatorFromValue<GenericAccumulatorFrom>, GenericExitOutput>): GenericExitOutput;
export {};
