import { PatternValueMaybeAll } from '..';
import { ComplexUnMatchedArray } from './array';
import { ComplexUnMatchedFunction } from './function';
import { GetIncompleteUnion } from './getIncompleteUnion';
import { ComplexUnMatchedMaybeAll } from './maybeAll';
import { ComplexUnMatchedObject } from './object';
import { ComplexUnMatchedPrimitive } from './primitive';
import { ComplexUnMatchedUnionObject } from './unionObject';
import type * as DCommon from '../../../common';
export type ComplexUnMatchedValue<GenericInput extends unknown, GenericPatternValue extends unknown> = (DCommon.IsEqual<GenericInput, unknown> extends true ? DCommon.AnyValue : GenericInput) extends infer InferredInput ? (InferredInput extends any ? DCommon.UnionToTuple<keyof GetIncompleteUnion<InferredInput, GenericPatternValue>>["length"] extends 0 | 1 ? never : InferredInput : never) extends infer InferredIncompleteUnionInput ? [
    Exclude<InferredInput, InferredIncompleteUnionInput>,
    Exclude<GenericPatternValue, PatternValueMaybeAll>
] extends [
    infer InferredSortedInput,
    infer InferredPatternValue
] ? (ComplexUnMatchedPrimitive<InferredSortedInput, InferredPatternValue> | ComplexUnMatchedObject<InferredSortedInput, InferredPatternValue> | ComplexUnMatchedArray<InferredSortedInput, InferredPatternValue> | ComplexUnMatchedUnionObject<InferredSortedInput, InferredPatternValue> | ComplexUnMatchedFunction<InferredSortedInput, InferredPatternValue> | ComplexUnMatchedMaybeAll<InferredSortedInput, GenericPatternValue> | InferredIncompleteUnionInput) : never : never : never;
