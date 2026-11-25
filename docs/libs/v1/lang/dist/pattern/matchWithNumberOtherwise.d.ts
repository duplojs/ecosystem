import type * as DCommon from '../common';
import type * as DNumber from '../number/types';
import type * as DObject from '../object';
type ComputeMatcher<GenericInput extends number> = DCommon.SimplifyType<{
    [Prop in GenericInput]?: (value: Prop) => unknown;
}>;
type ForbiddenMoreKey<GenericInput extends number, GenericMatcher extends object> = Exclude<keyof GenericMatcher, GenericInput> extends infer InferredKey ? DCommon.IsEqual<InferredKey, never> extends true ? unknown : DCommon.ComputedTypeError<`Key "${Extract<InferredKey, number>}" is forbidden.`> : never;
type HandledKeys<GenericMatcher extends object> = Extract<DObject.GetPropsWithValueExtends<GenericMatcher, DCommon.AnyFunction>, number>;
export declare function matchWithNumberOtherwise<GenericInput extends number, GenericClearInput extends Extract<DCommon.RemoveConstraint<GenericInput>, number>, GenericMatcher extends object, GenericOutput extends unknown>(matcher: (NoInfer<ComputeMatcher<GenericClearInput>> & GenericMatcher & ForbiddenMoreKey<GenericClearInput, GenericMatcher> & DObject.ForbiddenUndefinedProps<GenericMatcher>), otherwise: (value: DCommon.BreakGenericLink<Exclude<GenericInput, HandledKeys<GenericMatcher>>>) => GenericOutput): (input: GenericInput & DNumber.RequireSimpleLiteral<GenericClearInput>) => (ReturnType<Extract<GenericMatcher[keyof GenericMatcher], DCommon.AnyFunction>> | GenericOutput);
export declare function matchWithNumberOtherwise<GenericInput extends number, GenericClearInput extends Extract<DCommon.RemoveConstraint<GenericInput>, number>, GenericMatcher extends object, GenericOutput extends unknown>(input: GenericInput & DNumber.RequireSimpleLiteral<GenericClearInput>, matcher: (NoInfer<ComputeMatcher<GenericClearInput>> & GenericMatcher & ForbiddenMoreKey<GenericClearInput, GenericMatcher> & DObject.ForbiddenUndefinedProps<GenericMatcher>), otherwise: (value: DCommon.BreakGenericLink<Exclude<GenericInput, HandledKeys<GenericMatcher>>>) => GenericOutput): (ReturnType<Extract<GenericMatcher[keyof GenericMatcher], DCommon.AnyFunction>> | GenericOutput);
export {};
