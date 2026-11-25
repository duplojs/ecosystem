import { LoopOutputValue } from './loop';
import { EligibleLoopAccumulatorFromValue, LoopAccumulatorFromValue, LoopAccumulatorParams, LoopAccumulatorResult } from './loopAccumulator';
import type * as DCommon from '../common';
export interface AsyncLoopAccumulatorParams<GenericAccumulator extends unknown, GenericOutput extends unknown> extends LoopAccumulatorParams<GenericAccumulator, DCommon.MaybePromise<GenericOutput | undefined>> {
}
export declare function asyncLoopAccumulator<GenericAccumulatorFrom extends EligibleLoopAccumulatorFromValue, GenericRawNextOutput extends unknown, GenericResult extends DCommon.MaybePromise<LoopAccumulatorResult<LoopAccumulatorFromValue<GenericAccumulatorFrom>, DCommon.MaybePromise<GenericRawNextOutput | undefined>>>>(initialAccumulator: GenericAccumulatorFrom, loop: (params: AsyncLoopAccumulatorParams<LoopAccumulatorFromValue<GenericAccumulatorFrom>, GenericRawNextOutput>) => GenericResult): AsyncGenerator<Exclude<Awaited<LoopOutputValue<Awaited<GenericResult>>>, undefined>, unknown, unknown>;
