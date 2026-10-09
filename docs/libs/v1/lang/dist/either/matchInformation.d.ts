import { informationKind } from './kind';
import { Right } from './right';
import { Left } from './left';
import { GetInformation, GetValue } from './types';
import type * as DCommon from '../common';
import type * as DKind from '../kind';
import type * as DObject from '../object';
type Either = Right | Left;
type ComputeMatcher<GenericEither extends Either> = Extract<{
    [Prop in GetInformation<GenericEither>]: (value: GetValue<Extract<GenericEither, DKind.Kind<typeof informationKind, Prop>>>) => unknown;
}, any>;
type ForbiddenMoreKey<GenericInput extends unknown, GenericMatcher extends ComputeMatcher<Extract<GenericInput, Either>>> = DObject.ForbiddenKey<GenericMatcher, Extract<Exclude<keyof GenericMatcher, GetInformation<Extract<GenericInput, Either>>>, string>>;
export declare function matchInformation<GenericInput extends unknown, GenericMatcher extends ComputeMatcher<Extract<GenericInput, Either>>, GenericError extends ForbiddenMoreKey<GenericInput, GenericMatcher>>(matcher: (ComputeMatcher<Extract<NoInfer<GenericInput>, Either>> & GenericMatcher & NoInfer<GenericError>)): (input: GenericInput) => (ReturnType<NoInfer<GenericMatcher[keyof GenericMatcher]>> | Exclude<NoInfer<GenericInput>, Either>);
export declare function matchInformation<GenericInput extends unknown, GenericMatcher extends ComputeMatcher<Extract<GenericInput, Either>>>(input: GenericInput, matcher: DCommon.FixDeepFunctionInfer<ComputeMatcher<Extract<GenericInput, Either>>, GenericMatcher> & ForbiddenMoreKey<GenericInput, GenericMatcher>): (ReturnType<GenericMatcher[keyof GenericMatcher]> | Exclude<GenericInput, Either>);
export {};
