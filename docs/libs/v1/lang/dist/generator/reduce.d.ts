import type * as DCommon from '../common';
import type * as DKind from '../kind';
export interface ReduceNext<GenericOutput extends unknown = unknown> {
    "-next": GenericOutput;
}
export interface ReduceExit<GenericOutput extends unknown = unknown> {
    "-exit": GenericOutput;
}
export interface ReduceTheFunctionParams<GenericItem extends unknown = unknown, GenericOutput extends unknown = unknown> {
    item: GenericItem;
    index: number;
    lastValue: GenericOutput;
    nextWithObject: GenericOutput extends object ? (object1: GenericOutput, object2: Partial<GenericOutput>) => ReduceNext<GenericOutput> : undefined;
    next(output: GenericOutput): ReduceNext<GenericOutput>;
    exit<GenericExitValue extends unknown>(output: GenericExitValue): ReduceExit<GenericExitValue>;
    nextPush: GenericOutput extends readonly any[] ? (array: GenericOutput, ...values: GenericOutput) => ReduceNext<GenericOutput> : undefined;
}
export declare const reduceKind: DKind.Handler<DKind.Definition<"@DuplojsLangGenerator/reduce", unknown>>;
export interface ReduceFromResult<GenericValue extends unknown = unknown> extends DKind.Kind<typeof reduceKind, GenericValue> {
}
export declare function reduceFrom<GenericValue extends unknown>(value: GenericValue): ReduceFromResult<GenericValue>;
export type EligibleReduceFromValue = number | string | bigint | boolean | ReduceFromResult;
export type ReduceFromValue<GenericValue extends EligibleReduceFromValue> = GenericValue extends ReduceFromResult<infer InferredValue> ? InferredValue : DCommon.ToLargeEnsemble<GenericValue>;
export declare function reduce<GenericItem extends unknown, GenericReduceFrom extends EligibleReduceFromValue, GenericExit extends ReduceExit = ReduceExit<never>>(startValue: GenericReduceFrom, theFunction: (params: ReduceTheFunctionParams<GenericItem, ReduceFromValue<GenericReduceFrom>>) => ReduceNext<ReduceFromValue<GenericReduceFrom>> | GenericExit): (iterator: Iterable<GenericItem>) => ReduceFromValue<GenericReduceFrom> | (DCommon.IsEqual<GenericExit, ReduceExit> extends true ? never : GenericExit["-exit"]);
export declare function reduce<GenericItem extends unknown, GenericReduceFrom extends EligibleReduceFromValue, GenericExit extends ReduceExit = ReduceExit<never>>(iterator: Iterable<GenericItem>, startValue: GenericReduceFrom, theFunction: (params: ReduceTheFunctionParams<GenericItem, ReduceFromValue<GenericReduceFrom>>) => ReduceNext<ReduceFromValue<GenericReduceFrom>> | GenericExit): ReduceFromValue<GenericReduceFrom> | (DCommon.IsEqual<GenericExit, ReduceExit> extends true ? never : GenericExit["-exit"]);
