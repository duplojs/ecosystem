import { BreakGenericLink, IsEqual, IsNever, IsUnion, Or } from './types';
import type * as DArray from '../array';
import type * as DString from '../string';
export type EligibleEqual = string | null | number | undefined | bigint | boolean | symbol;
type ExpectValidInput<GenericValue extends readonly EligibleEqual[]> = IsUnion<GenericValue> extends true ? never : GenericValue extends readonly [] ? unknown : GenericValue extends readonly [
    infer InferredFirst extends EligibleEqual,
    ...infer InferredRest extends readonly EligibleEqual[]
] ? Or<[
    IsUnion<InferredFirst>,
    IsEqual<InferredFirst, string>,
    DString.IsTemplateLiteral<Extract<InferredFirst, string>>,
    IsEqual<InferredFirst, number>,
    IsEqual<InferredFirst, bigint>,
    IsEqual<InferredFirst, symbol>
]> extends true ? never : ExpectValidInput<InferredRest> : never;
type ComputeResult<GenericInput extends EligibleEqual | object, GenericValue extends EligibleEqual | (readonly EligibleEqual[])> = GenericInput extends unknown ? IsNever<Extract<GenericInput, DArray.Unwrap<GenericValue>>> extends true ? Exclude<GenericInput, object> & DArray.Unwrap<GenericValue> : Extract<GenericInput, DArray.Unwrap<GenericValue>> : never;
export declare function equal<GenericInput extends EligibleEqual | object, const GenericValue extends (Extract<GenericInput, EligibleEqual> | (readonly Extract<GenericInput, EligibleEqual>[]))>(value: (GenericValue & ExpectValidInput<DArray.Coalescing<GenericValue>> & (IsNever<ComputeResult<GenericInput, GenericValue>> extends true ? never : unknown))): (input: GenericInput) => input is ComputeResult<GenericInput, GenericValue>;
export declare function equal<GenericInput extends EligibleEqual | object>(value: Extract<BreakGenericLink<GenericInput>, EligibleEqual> | Extract<BreakGenericLink<GenericInput>, EligibleEqual>[]): (input: GenericInput) => boolean;
export declare function equal<GenericInput extends EligibleEqual | object, const GenericValue extends (Extract<GenericInput, EligibleEqual> | (readonly Extract<GenericInput, EligibleEqual>[]))>(input: GenericInput, value: (GenericValue & ExpectValidInput<DArray.Coalescing<GenericValue>> & (IsNever<ComputeResult<GenericInput, GenericValue>> extends true ? never : unknown))): input is ComputeResult<GenericInput, GenericValue>;
export declare function equal<GenericInput extends EligibleEqual | object>(input: GenericInput, value: Extract<BreakGenericLink<GenericInput>, EligibleEqual> | Extract<BreakGenericLink<GenericInput>, EligibleEqual>[]): boolean;
export {};
