import { Evidence } from './evidence';
import type * as DCommon from '../common';
import type * as DObject from '../object';
type EvidenceFunctionWithAdditionalResult = Evidence<"function-with-additional-result">;
export type AddAdditionalResultOnFunction<GenericFunction extends DCommon.AnyFunction, GenericResult extends unknown> = ((GenericFunction | (ReturnType<GenericFunction> extends infer InferredResult ? InferredResult extends Promise<any> | AsyncIterable<any> ? (() => Promise<GenericResult>) : (() => GenericResult) : never)) & EvidenceFunctionWithAdditionalResult);
export type AddAdditionalResultOnMethods<GenericObject extends object, GenericResults extends Partial<Record<GenericObject extends unknown ? DObject.GetPropsWithValueExtends<GenericObject, DCommon.AnyFunction> : never, unknown>>> = GenericObject extends unknown ? {
    [Prop in keyof GenericObject]: Prop extends keyof GenericResults ? AddAdditionalResultOnFunction<Extract<GenericObject[Prop], DCommon.AnyFunction>, GenericResults[Prop]> : GenericObject[Prop];
} : never;
export declare function withAdditionalResult<GenericFunction extends (DCommon.AnyFunction & EvidenceFunctionWithAdditionalResult)>(theFunction: (...args: Exclude<Parameters<GenericFunction>, readonly []> extends never ? readonly [] : Exclude<Parameters<GenericFunction>, readonly []>) => (Exclude<ReturnType<GenericFunction>, Promise<any>> | (Extract<ReturnType<GenericFunction>, Promise<any>> extends never ? never : DCommon.MergePromise<ReturnType<GenericFunction>>))): GenericFunction;
export {};
