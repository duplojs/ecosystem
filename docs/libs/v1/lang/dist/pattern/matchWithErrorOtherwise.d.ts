import * as DCommon from '../common';
import type * as DKind from '../kind';
import type * as DObject from '../object';
import type * as DString from '../string';
type ComputeMatcher<GenericError extends DCommon.DuploJSError> = {
    [Error in GenericError as DKind.GetValue<typeof DCommon.duploJSErrorKind, Error>]?: (value: Error) => unknown;
};
type ForbiddenMoreKey<GenericError extends DCommon.DuploJSError, GenericMatcher extends object> = DObject.ForbiddenKey<GenericMatcher, Extract<Exclude<keyof GenericMatcher, DKind.GetValue<typeof DCommon.duploJSErrorKind, GenericError>>, string>>;
type HandledKeys<GenericMatcher extends object> = Extract<DObject.GetPropsWithValueExtends<GenericMatcher, DCommon.AnyFunction>, string>;
type UnhandledError<GenericError extends DCommon.DuploJSError, GenericMatcher extends object> = Exclude<GenericError, DCommon.DuploJSError<HandledKeys<GenericMatcher>>>;
type RequireSimpleIdentifier<GenericError extends DCommon.DuploJSError> = DString.RequireSimpleLiteral<DKind.GetValue<typeof DCommon.duploJSErrorKind, GenericError>>;
export declare function matchWithErrorOtherwise<GenericError extends DCommon.DuploJSError, GenericOutput>(input: GenericError & RequireSimpleIdentifier<GenericError>, matcher: Record<string, never>, otherwise: (value: GenericError) => GenericOutput): GenericOutput;
export declare function matchWithErrorOtherwise<GenericError extends DCommon.DuploJSError, GenericMatcher extends object, GenericOutput>(matcher: (NoInfer<ComputeMatcher<GenericError>> & GenericMatcher & ForbiddenMoreKey<NoInfer<GenericError>, GenericMatcher> & DObject.ForbiddenUndefinedProps<GenericMatcher>), otherwise: (value: DCommon.BreakGenericLink<UnhandledError<GenericError, GenericMatcher>>) => GenericOutput): (input: GenericError & RequireSimpleIdentifier<GenericError>) => (ReturnType<Extract<NoInfer<GenericMatcher>[keyof GenericMatcher], DCommon.AnyFunction>> | GenericOutput);
export declare function matchWithErrorOtherwise<GenericError extends DCommon.DuploJSError, GenericOutput>(matcher: Record<string, never>, otherwise: (value: DCommon.BreakGenericLink<GenericError>) => GenericOutput): (input: GenericError & RequireSimpleIdentifier<GenericError>) => GenericOutput;
export declare function matchWithErrorOtherwise<GenericError extends DCommon.DuploJSError, GenericMatcher extends object, GenericOutput>(input: GenericError & RequireSimpleIdentifier<GenericError>, matcher: (NoInfer<ComputeMatcher<GenericError>> & GenericMatcher & ForbiddenMoreKey<GenericError, GenericMatcher> & DObject.ForbiddenUndefinedProps<GenericMatcher>), otherwise: (value: DCommon.BreakGenericLink<UnhandledError<GenericError, GenericMatcher>>) => GenericOutput): (ReturnType<Extract<GenericMatcher[keyof GenericMatcher], DCommon.AnyFunction>> | GenericOutput);
export {};
