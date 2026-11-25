import { LoopResult, LoopOutputValue, LoopParams } from './loop';
import type * as DCommon from '../common';
export interface AsyncLoopParams<GenericOutput extends unknown> extends LoopParams<DCommon.MaybePromise<GenericOutput | undefined>> {
}
export declare function asyncLoop<GenericRawNextOutput extends unknown, GenericResult extends DCommon.MaybePromise<LoopResult<DCommon.MaybePromise<GenericRawNextOutput | undefined>>>>(loop: (params: AsyncLoopParams<GenericRawNextOutput>) => GenericResult): AsyncGenerator<Exclude<Awaited<LoopOutputValue<Awaited<GenericResult>>>, undefined>, unknown, unknown>;
