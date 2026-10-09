import type * as DCommon from '../common';
import * as DModeling from '../modeling';
import type * as DObject from '../object';
import type * as DString from '../string';
type ComputeMatcher<GenericFact extends DModeling.Fact> = {
    [Fact in GenericFact as DModeling.GetFactName<Fact>]: (value: Fact, payload: DModeling.GetFactPayload<Fact>) => unknown;
};
type ForbiddenMoreKey<GenericFact extends DModeling.Fact, GenericMatcher extends ComputeMatcher<GenericFact>> = DObject.ForbiddenKey<GenericMatcher, Extract<Exclude<keyof GenericMatcher, DModeling.GetFactName<GenericFact>>, string>>;
type RequireSimpleName<GenericFact extends DModeling.Fact> = DString.RequireSimpleLiteral<DModeling.GetFactName<GenericFact>>;
export declare function matchWithFact<GenericFact extends DModeling.Fact, GenericMatcher extends ComputeMatcher<GenericFact>>(matcher: (DCommon.FixDeepFunctionInfer<ComputeMatcher<GenericFact>, GenericMatcher> & ForbiddenMoreKey<NoInfer<GenericFact>, GenericMatcher>)): (input: GenericFact & RequireSimpleName<GenericFact>) => ReturnType<Extract<NoInfer<GenericMatcher>[keyof GenericMatcher], DCommon.AnyFunction>>;
export declare function matchWithFact<GenericFact extends DModeling.Fact, GenericMatcher extends ComputeMatcher<GenericFact>>(input: GenericFact & RequireSimpleName<GenericFact>, matcher: (DCommon.FixDeepFunctionInfer<ComputeMatcher<GenericFact>, GenericMatcher> & ForbiddenMoreKey<GenericFact, GenericMatcher>)): ReturnType<Extract<GenericMatcher[keyof GenericMatcher], DCommon.AnyFunction>>;
export {};
