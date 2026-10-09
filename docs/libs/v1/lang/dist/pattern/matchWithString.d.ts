import type * as DCommon from '../common';
import type * as DObject from '../object';
import type * as DString from '../string/types';
type ComputeMatcher<GenericInput extends string> = DCommon.SimplifyType<{
    [Prop in GenericInput]: (value: Prop) => unknown;
}>;
type ForbiddenMoreKey<GenericInput extends string, GenericMatcher extends ComputeMatcher<GenericInput>> = DObject.ForbiddenKey<GenericMatcher, Extract<Exclude<keyof GenericMatcher, GenericInput>, string>>;
export declare function matchWithString<GenericInput extends string, GenericClearInput extends Extract<DCommon.RemoveConstraint<GenericInput>, string>, GenericMatcher extends ComputeMatcher<GenericClearInput>>(matcher: (DCommon.FixDeepFunctionInfer<ComputeMatcher<GenericClearInput>, GenericMatcher> & ForbiddenMoreKey<GenericClearInput, GenericMatcher>)): (input: GenericInput & DString.RequireSimpleLiteral<GenericClearInput>) => ReturnType<GenericMatcher[keyof GenericMatcher]>;
export declare function matchWithString<GenericInput extends string, GenericClearInput extends Extract<DCommon.RemoveConstraint<GenericInput>, string>, GenericMatcher extends ComputeMatcher<GenericClearInput>>(input: GenericInput & DString.RequireSimpleLiteral<GenericClearInput>, matcher: (DCommon.FixDeepFunctionInfer<ComputeMatcher<GenericClearInput>, GenericMatcher> & ForbiddenMoreKey<GenericClearInput, GenericMatcher>)): ReturnType<GenericMatcher[keyof GenericMatcher]>;
export {};
