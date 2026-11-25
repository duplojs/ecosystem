import type * as DCommon from '../common';
import type * as DObject from '../object';
import type * as DString from '../string';
type ComputeMatcher<GenericInput extends string> = DCommon.SimplifyType<{
    [Prop in GenericInput]?: (value: Prop) => unknown;
}>;
type ForbiddenMoreKey<GenericInput extends string, GenericMatcher extends object> = DObject.ForbiddenKey<GenericMatcher, Extract<Exclude<keyof GenericMatcher, GenericInput>, string>>;
type HandledKeys<GenericMatcher extends object> = Extract<DObject.GetPropsWithValueExtends<GenericMatcher, DCommon.AnyFunction>, string>;
export declare function matchWithStringOtherwise<GenericInput extends string, GenericClearInput extends Extract<DCommon.RemoveConstraint<GenericInput>, string>, GenericMatcher extends object, GenericOutput extends unknown>(matcher: (NoInfer<ComputeMatcher<GenericClearInput>> & GenericMatcher & ForbiddenMoreKey<GenericClearInput, GenericMatcher> & DObject.ForbiddenUndefinedProps<GenericMatcher>), otherwise: (value: DCommon.BreakGenericLink<Exclude<GenericInput, HandledKeys<GenericMatcher>>>) => GenericOutput): (input: GenericInput & DString.RequireSimpleLiteral<GenericClearInput>) => (ReturnType<Extract<GenericMatcher[keyof GenericMatcher], DCommon.AnyFunction>> | GenericOutput);
export declare function matchWithStringOtherwise<GenericInput extends string, GenericClearInput extends Extract<DCommon.RemoveConstraint<GenericInput>, string>, GenericMatcher extends object, GenericOutput extends unknown>(input: GenericInput & DString.RequireSimpleLiteral<GenericClearInput>, matcher: (NoInfer<ComputeMatcher<GenericClearInput>> & GenericMatcher & ForbiddenMoreKey<GenericClearInput, GenericMatcher> & DObject.ForbiddenUndefinedProps<GenericMatcher>), otherwise: (value: DCommon.BreakGenericLink<Exclude<GenericInput, HandledKeys<GenericMatcher>>>) => GenericOutput): (ReturnType<Extract<GenericMatcher[keyof GenericMatcher], DCommon.AnyFunction>> | GenericOutput);
export {};
