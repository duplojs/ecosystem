import { AnyFunction, AnyTuple, ComputedTypeError, IsEqual, NeverCoalescing, Or, UnionToIntersection } from './types';
import type * as DObject from '../object';
export type Transformer<GenericValue extends unknown, GenericMethodName extends string> = GenericValue extends Record<GenericMethodName, () => unknown> ? ReturnType<GenericValue[GenericMethodName]> : GenericValue extends readonly unknown[] & AnyTuple ? Transformer<GenericValue[number], GenericMethodName>[] : GenericValue extends readonly [infer InferredFirst, ...infer InferredRest] ? [
    Transformer<InferredFirst, GenericMethodName>,
    ...Extract<Transformer<InferredRest, GenericMethodName>, readonly unknown[]>
] : GenericValue extends readonly [] ? [] : GenericValue extends readonly unknown[] ? Transformer<GenericValue[number], GenericMethodName>[] : GenericValue extends string ? GenericValue : GenericValue extends Record<number, unknown> ? {
    [Prop in keyof GenericValue]: Transformer<GenericValue[Prop], GenericMethodName>;
} : GenericValue;
type TransformArgumentObjectErrors<GenericValue extends unknown, GenericMethodName extends string> = {
    [Prop in keyof GenericValue]: CheckTransformArgument<GenericValue[Prop], GenericMethodName>;
} extends infer InferredResult extends object ? UnionToIntersection<NeverCoalescing<InferredResult[DObject.GetPropsWithValueExtends<InferredResult, object>], unknown>> : never;
type CheckTransformArgumentValue<GenericValue extends unknown, GenericMethodName extends string> = Or<[
    IsEqual<GenericValue, unknown>,
    IsEqual<GenericValue, never>,
    IsEqual<GenericValue, object>,
    IsEqual<GenericValue, any>,
    IsEqual<GenericMethodName, string>
]> extends true ? ComputedTypeError<"Input contain an indeterminate value."> : GenericValue extends Record<GenericMethodName, () => unknown> ? unknown : GenericValue extends Record<GenericMethodName, AnyFunction> ? ComputedTypeError<`A method ${GenericMethodName} in input have an argument.`> : GenericValue extends readonly unknown[] & AnyTuple ? CheckTransformArgument<Extract<GenericValue, readonly unknown[]>[number], GenericMethodName> : GenericValue extends readonly [infer InferredFirst, ...infer InferredRest] ? (CheckTransformArgument<InferredFirst, GenericMethodName> & CheckTransformArgument<InferredRest, GenericMethodName>) : GenericValue extends readonly [] ? unknown : GenericValue extends string ? unknown : GenericValue extends readonly (infer InferredValue)[] ? CheckTransformArgument<InferredValue, GenericMethodName> : GenericValue extends Record<number, unknown> ? TransformArgumentObjectErrors<GenericValue, GenericMethodName> : unknown;
export type CheckTransformArgument<GenericValue extends unknown, GenericMethodName extends string = string> = NeverCoalescing<GenericValue extends unknown ? CheckTransformArgumentValue<GenericValue, GenericMethodName> extends infer InferredResult ? IsEqual<InferredResult, unknown> extends true ? never : InferredResult : never : never, unknown>;
export declare function transformer<GenericInput extends unknown, GenericMethodName extends string>(input: GenericInput & CheckTransformArgument<GenericInput, GenericMethodName>, methodName: GenericMethodName): Transformer<GenericInput, GenericMethodName>;
export type TransformerFunction<GenericMethodName extends string = string> = <GenericInput extends unknown>(input: GenericInput) => Transformer<GenericInput, GenericMethodName>;
export declare function createTransformer<GenericMethodName extends string>(methodName: GenericMethodName): TransformerFunction<GenericMethodName>;
export declare const toNative: TransformerFunction<"toNative">;
export declare const toJSON: TransformerFunction<"toJSON">;
export {};
