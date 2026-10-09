import type * as DCommon from '../common';
import * as DModeling from '../modeling';
import type * as DObject from '../object';
import type * as DString from '../string';
type ComputeMatcher<GenericFact extends DModeling.Fact> = {
    [Fact in GenericFact as DModeling.GetFactName<Fact>]?: (value: Fact, payload: DModeling.GetFactPayload<Fact>) => unknown;
};
type ForbiddenMoreKey<GenericFact extends DModeling.Fact, GenericMatcher extends ComputeMatcher<GenericFact>> = DObject.ForbiddenKey<GenericMatcher, Extract<Exclude<keyof GenericMatcher, DModeling.GetFactName<GenericFact>>, string>>;
type HandledKeys<GenericMatcher extends object> = Extract<DObject.GetPropsWithValueExtends<GenericMatcher, DCommon.AnyFunction>, string>;
type UnhandledFact<GenericFact extends DModeling.Fact, GenericMatcher extends object> = GenericFact extends DModeling.Fact ? DModeling.GetFactName<GenericFact> extends HandledKeys<GenericMatcher> ? never : GenericFact : never;
type RequireSimpleName<GenericFact extends DModeling.Fact> = DString.RequireSimpleLiteral<DModeling.GetFactName<GenericFact>>;
export declare function matchWithFactOtherwise<GenericFact extends DModeling.Fact, GenericMatcher extends ComputeMatcher<GenericFact>, GenericOutput>(matcher: (DCommon.FixDeepFunctionInfer<ComputeMatcher<GenericFact>, GenericMatcher> & ForbiddenMoreKey<NoInfer<GenericFact>, GenericMatcher>), otherwise: (value: DCommon.BreakGenericLink<UnhandledFact<GenericFact, GenericMatcher>>) => GenericOutput): (input: GenericFact & RequireSimpleName<GenericFact>) => (ReturnType<Extract<NoInfer<GenericMatcher>[keyof GenericMatcher], DCommon.AnyFunction>> | GenericOutput);
export declare function matchWithFactOtherwise<GenericFact extends DModeling.Fact, GenericMatcher extends ComputeMatcher<GenericFact>, GenericOutput>(input: GenericFact & RequireSimpleName<GenericFact>, matcher: (DCommon.FixDeepFunctionInfer<ComputeMatcher<GenericFact>, GenericMatcher> & ForbiddenMoreKey<GenericFact, GenericMatcher>), otherwise: (value: DCommon.BreakGenericLink<UnhandledFact<GenericFact, GenericMatcher>>) => GenericOutput): (ReturnType<Extract<GenericMatcher[keyof GenericMatcher], DCommon.AnyFunction>> | GenericOutput);
export {};
