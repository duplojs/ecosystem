import { informationKind } from './kind';
import { Right } from './right';
import { Left } from './left';
import { GetInformation, GetValue } from './types';
import type * as DCommon from '../common';
import type * as DKind from '../kind';
import type * as DObject from '../object';
type Either = Right | Left;
type ComputeMatcher<GenericEither extends Either> = Extract<{
    [Prop in GetInformation<GenericEither>]?: (value: GetValue<Extract<GenericEither, DKind.Kind<typeof informationKind, Prop>>>) => unknown;
}, any>;
type ForbiddenMoreKey<GenericInput extends unknown, GenericMatcher extends object> = DObject.ForbiddenKey<GenericMatcher, Extract<Exclude<keyof GenericMatcher, GetInformation<Extract<GenericInput, Either>>>, string>>;
type UnhandledInput<GenericInput extends unknown, GenericMatcher extends object> = DCommon.BreakGenericLink<Exclude<GenericInput, DKind.Kind<typeof informationKind, Extract<DObject.GetPropsWithValueExtends<GenericMatcher, DCommon.AnyFunction>, string>>>>;
export declare function matchInformationOtherwise<GenericInput extends unknown, GenericMatcher extends object, GenericOutput extends unknown, GenericError extends (ForbiddenMoreKey<GenericInput, GenericMatcher> & DObject.ForbiddenUndefinedProps<GenericMatcher>)>(matcher: (NoInfer<ComputeMatcher<Extract<GenericInput, Either>>> & GenericMatcher & NoInfer<GenericError>), otherwise: (value: UnhandledInput<GenericInput, GenericMatcher>) => GenericOutput): (input: GenericInput) => (ReturnType<NoInfer<Extract<GenericMatcher[keyof GenericMatcher], DCommon.AnyFunction>>> | GenericOutput);
export declare function matchInformationOtherwise<GenericInput extends unknown, GenericMatcher extends object, GenericOutput extends unknown>(input: GenericInput, matcher: (NoInfer<ComputeMatcher<Extract<GenericInput, Either>>> & GenericMatcher & ForbiddenMoreKey<GenericInput, GenericMatcher> & DObject.ForbiddenUndefinedProps<GenericMatcher>), otherwise: (value: UnhandledInput<GenericInput, GenericMatcher>) => GenericOutput): (ReturnType<NoInfer<Extract<GenericMatcher[keyof GenericMatcher], DCommon.AnyFunction>>> | GenericOutput);
export {};
