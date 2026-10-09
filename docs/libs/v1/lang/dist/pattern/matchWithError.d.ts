import * as DCommon from '../common';
import type * as DKind from '../kind';
import type * as DObject from '../object';
import type * as DString from '../string';
type ComputeMatcher<GenericError extends DCommon.DuploJSError> = {
    [Error in GenericError as DKind.GetValue<typeof DCommon.duploJSErrorKind, Error>]: (value: Error) => unknown;
};
type ForbiddenMoreKey<GenericError extends DCommon.DuploJSError, GenericMatcher extends ComputeMatcher<GenericError>> = DObject.ForbiddenKey<GenericMatcher, Extract<Exclude<keyof GenericMatcher, DKind.GetValue<typeof DCommon.duploJSErrorKind, GenericError>>, string>>;
type RequireSimpleIdentifier<GenericError extends DCommon.DuploJSError> = DString.RequireSimpleLiteral<DKind.GetValue<typeof DCommon.duploJSErrorKind, GenericError>>;
export declare function matchWithError<GenericError extends DCommon.DuploJSError, GenericMatcher extends ComputeMatcher<GenericError>>(matcher: (DCommon.FixDeepFunctionInfer<ComputeMatcher<GenericError>, GenericMatcher> & ForbiddenMoreKey<NoInfer<GenericError>, GenericMatcher>)): (input: GenericError & RequireSimpleIdentifier<GenericError>) => ReturnType<Extract<NoInfer<GenericMatcher>[keyof GenericMatcher], DCommon.AnyFunction>>;
export declare function matchWithError<GenericError extends DCommon.DuploJSError, GenericMatcher extends ComputeMatcher<GenericError>>(input: GenericError & RequireSimpleIdentifier<GenericError>, matcher: (DCommon.FixDeepFunctionInfer<ComputeMatcher<GenericError>, GenericMatcher> & ForbiddenMoreKey<GenericError, GenericMatcher>)): ReturnType<Extract<GenericMatcher[keyof GenericMatcher], DCommon.AnyFunction>>;
export {};
