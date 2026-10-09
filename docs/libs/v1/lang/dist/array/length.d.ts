import { ExtractMinElements, MinElements, ExtractMaxElements, MaxElements } from './constraints';
import type * as DCommon from '../common';
import type * as DNumber from '../number';
type LengthOutput<GenericArray extends readonly unknown[]> = Extract<GenericArray extends unknown ? (number & DNumber.Positive & (ExtractMaxElements<GenericArray, unknown> extends MaxElements<infer InferredValue> ? DCommon.UnionToIntersection<InferredValue extends number ? DNumber.LessThanOrEqual<InferredValue> : never> : unknown) & (ExtractMinElements<GenericArray, unknown> extends MinElements<infer InferredValue> ? DCommon.UnionToIntersection<InferredValue extends number ? DNumber.GreaterThanOrEqual<InferredValue> : never> : unknown)) : never, any>;
export declare function length<const GenericArray extends readonly unknown[]>(array: GenericArray): LengthOutput<GenericArray>;
export {};
