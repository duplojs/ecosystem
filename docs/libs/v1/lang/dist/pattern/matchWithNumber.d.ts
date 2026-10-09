import type * as DCommon from '../common';
import type * as DNumber from '../number/types';
type ComputeMatcher<GenericInput extends number> = DCommon.SimplifyType<{
    [Prop in GenericInput]: (value: Prop) => unknown;
}>;
type ForbiddenMoreKey<GenericInput extends number, GenericMatcher extends ComputeMatcher<GenericInput>> = Exclude<keyof GenericMatcher, GenericInput> extends infer InferredKey ? DCommon.IsEqual<InferredKey, never> extends true ? unknown : DCommon.ComputedTypeError<`Key "${Extract<InferredKey, number>}" is forbidden.`> : never;
export declare function matchWithNumber<GenericInput extends number, GenericClearInput extends Extract<DCommon.RemoveConstraint<GenericInput>, number>, GenericMatcher extends ComputeMatcher<GenericClearInput>>(matcher: (DCommon.FixDeepFunctionInfer<ComputeMatcher<GenericClearInput>, GenericMatcher> & ForbiddenMoreKey<GenericClearInput, GenericMatcher>)): (input: GenericInput & DNumber.RequireSimpleLiteral<GenericClearInput>) => ReturnType<GenericMatcher[keyof GenericMatcher]>;
export declare function matchWithNumber<GenericInput extends number, GenericClearInput extends Extract<DCommon.RemoveConstraint<GenericInput>, number>, GenericMatcher extends ComputeMatcher<GenericClearInput>>(input: GenericInput & DNumber.RequireSimpleLiteral<GenericClearInput>, matcher: (DCommon.FixDeepFunctionInfer<ComputeMatcher<GenericClearInput>, GenericMatcher> & ForbiddenMoreKey<GenericClearInput, GenericMatcher>)): ReturnType<GenericMatcher[keyof GenericMatcher]>;
export {};
