import type * as DKind from '../kind';
import type * as DCommon from '../common';
export interface ReduceNext<GenericOutput extends unknown = unknown> {
    "-next": GenericOutput;
}
export interface ReduceExit<GenericOutput extends unknown = unknown> {
    "-exit": GenericOutput;
}
export interface ReduceTheFunctionParams<GenericArray extends readonly unknown[] = unknown[], GenericOutput extends unknown = unknown> {
    element: GenericArray[number];
    index: number;
    lastValue: GenericOutput;
    nextWithObject: GenericOutput extends object ? (object1: GenericOutput, object2: Partial<GenericOutput>) => ReduceNext<GenericOutput> : undefined;
    next(output: GenericOutput): ReduceNext<GenericOutput>;
    exit<GenericExitValue extends unknown>(output: GenericExitValue): ReduceExit<GenericExitValue>;
    self: GenericArray;
    nextPush: GenericOutput extends readonly any[] ? (array: GenericOutput, ...values: GenericOutput) => ReduceNext<GenericOutput> : undefined;
}
export declare const reduceKind: DKind.Handler<DKind.Definition<"@DuplojsLangArray/reduce", unknown>>;
export interface ReduceFromResult<GenericValue extends unknown = unknown> extends DKind.Kind<typeof reduceKind, GenericValue> {
}
export declare function reduceFrom<GenericValue extends unknown>(value: GenericValue): ReduceFromResult<GenericValue>;
export declare const reduceTools: Pick<ReduceTheFunctionParams<any, any>, "exit" | "next" | "nextWithObject" | "nextPush">;
export type EligibleReduceFromValue = number | string | bigint | boolean | ReduceFromResult;
export type ReduceFromValue<GenericValue extends EligibleReduceFromValue> = GenericValue extends ReduceFromResult<infer InferredValue> ? InferredValue : DCommon.ToLargeEnsemble<GenericValue>;
export declare function reduce<GenericArray extends readonly unknown[], GenericReduceFrom extends EligibleReduceFromValue, GenericExit extends ReduceExit = ReduceExit<never>>(fromValue: GenericReduceFrom, theFunction: (params: ReduceTheFunctionParams<GenericArray, ReduceFromValue<GenericReduceFrom>>) => ReduceNext<ReduceFromValue<GenericReduceFrom>> | GenericExit): (array: GenericArray) => ReduceFromValue<GenericReduceFrom> | (DCommon.IsEqual<GenericExit, ReduceExit> extends true ? never : GenericExit["-exit"]);
export declare function reduce<GenericArray extends readonly unknown[], GenericReduceFrom extends number | string | bigint | boolean | ReduceFromResult, GenericExit extends ReduceExit = ReduceExit<never>>(array: GenericArray, fromValue: GenericReduceFrom, theFunction: (params: ReduceTheFunctionParams<GenericArray, ReduceFromValue<GenericReduceFrom>>) => ReduceNext<ReduceFromValue<GenericReduceFrom>> | GenericExit): ReduceFromValue<GenericReduceFrom> | (DCommon.IsEqual<GenericExit, ReduceExit> extends true ? never : GenericExit["-exit"]);
