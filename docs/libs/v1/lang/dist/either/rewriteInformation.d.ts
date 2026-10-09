import { Left } from './left';
import { Right } from './right';
import { GetInformation, GetValue } from './types';
import type * as DCommon from '../common';
import type * as DObject from '../object';
type Either = Right | Left;
type ComputeMatcher<GenericInput extends unknown> = {
    [Prop in GetInformation<Extract<GenericInput, Either>>]?: string;
};
type ForbiddenMoreKey<GenericInput extends unknown, GenericMatcher extends ComputeMatcher<GenericInput>> = DObject.ForbiddenKey<GenericMatcher, Extract<Exclude<keyof GenericMatcher, GetInformation<Extract<GenericInput, Either>>>, string>>;
type ComputeResult<GenericInput extends unknown, GenericMatcher extends ComputeMatcher<GenericInput>> = GenericInput extends Right ? GetInformation<GenericInput> extends keyof GenericMatcher ? Right<Extract<GenericMatcher[GetInformation<GenericInput>], string>, GetValue<GenericInput>> : GenericInput : GenericInput extends Left ? GetInformation<GenericInput> extends keyof GenericMatcher ? Left<Extract<GenericMatcher[GetInformation<GenericInput>], string>, GetValue<GenericInput>> : GenericInput : GenericInput;
export declare function rewriteInformation<GenericInput extends Either | DCommon.AnyValue, const GenericMatcher extends ComputeMatcher<GenericInput>>(matcher: (GenericMatcher & ForbiddenMoreKey<GenericInput, GenericMatcher> & DObject.ForbiddenUndefinedProps<GenericMatcher>)): (input: GenericInput) => ComputeResult<GenericInput, GenericMatcher>;
export declare function rewriteInformation<GenericInput extends Either | DCommon.AnyValue, const GenericMatcher extends ComputeMatcher<GenericInput>>(input: GenericInput, matcher: (GenericMatcher & ForbiddenMoreKey<GenericInput, GenericMatcher> & DObject.ForbiddenUndefinedProps<GenericMatcher>)): ComputeResult<GenericInput, GenericMatcher>;
export {};
