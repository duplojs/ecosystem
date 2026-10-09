import { createKind } from './kind';
import { AnyAbstractConstructor } from './types';
import * as DKind from '../kind';
export declare const duploJSErrorKind: DKind.Handler<DKind.Definition<"@DuplojsLangCommon/duplojs-error", string>>;
declare const DuploJSError_base: DKind.KindClass<DKind.Handler<DKind.Definition<"@DuplojsLangCommon/duplojs-error", string>>, ErrorConstructor>;
export declare abstract class DuploJSError<GenericIdentifier extends string = string, GenericCause extends Error | string = Error | string> extends DuploJSError_base<GenericIdentifier, Error> {
    cause: GenericCause extends Error ? GenericCause : undefined;
    constructor(identifier: GenericIdentifier, cause: GenericCause);
    static parentClass<GenericIdentifier extends string>(identifier: GenericIdentifier): abstract new (error: string) => (DuploJSError<GenericIdentifier, string> & DKind.Kind<DKind.Handler<DKind.Definition<`@${DKind.GetNamespaceName<typeof createKind>}/duplojs-error-${GenericIdentifier}`>>>);
    static parentClass<GenericIdentifier extends string, GenericCauseConstructor extends AnyAbstractConstructor<any[], Error>>(identifier: GenericIdentifier, causeConstructor: GenericCauseConstructor): abstract new (error: InstanceType<GenericCauseConstructor>) => (DuploJSError<GenericIdentifier, InstanceType<GenericCauseConstructor>> & DKind.Kind<DKind.Handler<DKind.Definition<`@${DKind.GetNamespaceName<typeof createKind>}/duplojs-error-${GenericIdentifier}`>>>);
    static hasIdentifier<GenericInput extends unknown, GenericIdentifier extends DKind.GetValue<typeof duploJSErrorKind, Extract<GenericInput, DuploJSError>>>(identifier: GenericIdentifier | GenericIdentifier[]): (input: GenericInput) => input is Extract<GenericInput, DuploJSError<GenericIdentifier>>;
    static hasIdentifier<GenericInput extends unknown, GenericIdentifier extends DKind.GetValue<typeof duploJSErrorKind, Extract<GenericInput, DuploJSError>>>(input: GenericInput, identifier: GenericIdentifier | GenericIdentifier[]): input is Extract<GenericInput, DuploJSError<GenericIdentifier>>;
}
export {};
