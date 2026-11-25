import { LoopOutputExistResult, LoopOutputNextResult, LoopOutputValue } from './loop';
import type * as DCommon from '../common';
import type * as DKind from '../kind';
export interface LoopAccumulatorOutputNextResult<GenericAccumulator extends unknown = unknown, GenericOutput extends unknown = unknown> extends LoopOutputNextResult<GenericOutput> {
    accumulator: GenericAccumulator;
}
export interface LoopAccumulatorOutputExistResult<GenericOutput extends unknown = unknown> extends LoopOutputExistResult<GenericOutput> {
}
export interface LoopAccumulatorParams<GenericAccumulator extends unknown, GenericRawNextOutput extends unknown> {
    count: number;
    accumulator: GenericAccumulator;
    next<const GenericOutputs extends readonly (GenericRawNextOutput | undefined)[]>(accumulator: GenericAccumulator, ...outputs: GenericOutputs): LoopAccumulatorOutputNextResult<GenericAccumulator, GenericOutputs[number]>;
    exit<const GenericOutputs extends readonly (GenericRawNextOutput | undefined)[]>(...outputs: GenericOutputs): LoopAccumulatorOutputExistResult<GenericOutputs[number]>;
}
export declare const loopAccumulatorKind: DKind.Handler<DKind.Definition<"@DuplojsLangGenerator/loop-accumulator", unknown>>;
export interface LoopAccumulatorFromResult<GenericValue extends unknown = unknown> extends DKind.Kind<typeof loopAccumulatorKind, GenericValue> {
}
export declare function loopAccumulatorFrom<GenericValue extends unknown>(value: GenericValue): LoopAccumulatorFromResult<GenericValue>;
export type EligibleLoopAccumulatorFromValue = number | string | bigint | boolean | LoopAccumulatorFromResult;
export type LoopAccumulatorFromValue<GenericValue extends EligibleLoopAccumulatorFromValue> = GenericValue extends LoopAccumulatorFromResult<infer InferredValue> ? InferredValue : DCommon.ToLargeEnsemble<GenericValue>;
export type LoopAccumulatorResult<GenericAccumulator extends unknown = unknown, GenericOutput extends unknown = unknown> = (LoopAccumulatorOutputNextResult<GenericAccumulator, GenericOutput> | LoopAccumulatorOutputExistResult<GenericOutput>);
export declare function loopAccumulator<GenericAccumulatorFrom extends EligibleLoopAccumulatorFromValue, GenericRawNextOutput extends unknown, GenericResult extends LoopAccumulatorResult<LoopAccumulatorFromValue<GenericAccumulatorFrom>, GenericRawNextOutput | undefined>>(initialAccumulator: GenericAccumulatorFrom, loop: (params: LoopAccumulatorParams<LoopAccumulatorFromValue<GenericAccumulatorFrom>, GenericRawNextOutput>) => GenericResult): Generator<Exclude<LoopOutputValue<GenericResult>, undefined>, unknown, unknown>;
