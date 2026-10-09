import { PatternValueMaybeAll } from '..';
import { ComplexMatchedArray } from './array';
import { ComplexMatchedFunction } from './function';
import { ComplexMatchedMaybeAll } from './maybeAll';
import { ComplexMatchedObject } from './object';
import { ComplexMatchedPrimitive } from './primitive';
import type * as DCommon from '../../../common';
export type ComplexMatchedValue<GenericInput extends unknown, GenericPatternValue extends unknown> = (DCommon.IsEqual<GenericInput, unknown> extends true ? DCommon.AnyValue : GenericInput) extends infer InferredInput ? Exclude<GenericPatternValue, PatternValueMaybeAll> extends infer InferredPatternValue ? (ComplexMatchedPrimitive<InferredInput, InferredPatternValue> | ComplexMatchedObject<InferredInput, InferredPatternValue> | ComplexMatchedArray<InferredInput, InferredPatternValue> | ComplexMatchedFunction<InferredInput, InferredPatternValue> | ComplexMatchedMaybeAll<InferredInput, GenericPatternValue>) : never : never;
