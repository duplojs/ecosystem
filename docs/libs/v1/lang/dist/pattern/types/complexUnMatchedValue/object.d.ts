import { ComplexUnMatchedValue } from '.';
import type * as DCommon from '../../../common';
export type ComplexUnMatchedObject<GenericInput extends unknown, GenericPatternValue extends unknown> = ([
    Exclude<Extract<GenericInput, object>, readonly any[] | DCommon.AnyFunction>,
    Exclude<Extract<GenericPatternValue, object>, readonly any[] | DCommon.AnyFunction>
] extends [
    infer InferredInput,
    infer InferredPatternValue
] ? DCommon.IsEqual<InferredPatternValue, never> extends true ? InferredInput : DCommon.IsUnion<InferredPatternValue> extends true ? never : InferredInput extends any ? InferredInput extends InferredPatternValue ? never : DCommon.IsEqual<Extract<keyof InferredInput, keyof InferredPatternValue>, keyof InferredPatternValue> extends false ? InferredInput : (DCommon.IsEqual<{
    [Prop in keyof InferredPatternValue]: ComplexUnMatchedValue<InferredInput[Extract<Prop, keyof InferredInput>], InferredPatternValue[Prop]>;
} extends infer InferredObjectArray extends object ? InferredObjectArray[keyof InferredObjectArray] : never, never> extends true ? never : ({
    -readonly [Prop in keyof InferredPatternValue]: DCommon.NeverCoalescing<Extract<ComplexUnMatchedValue<InferredInput[Extract<Prop, keyof InferredInput>], InferredPatternValue[Prop]>, any>, InferredInput[Extract<Prop, keyof InferredInput>]>;
} & Omit<InferredInput, keyof InferredPatternValue>) extends infer InferredObject extends object ? ({
    [Prop in keyof InferredObject as undefined extends InferredObject[Prop] ? Prop : never]?: InferredObject[Prop];
} & {
    [Prop in keyof InferredObject as undefined extends InferredObject[Prop] ? never : Prop]: InferredObject[Prop];
}) extends infer InferredResult ? DCommon.IsEqual<DCommon.RemoveReadonly<InferredResult>, DCommon.RemoveReadonly<InferredInput>> extends true ? InferredInput : DCommon.SimplifyTopLevel<InferredResult> : never : never) : never : never);
