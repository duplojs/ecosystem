import { DuploJSError } from './error';
declare const AssertsError_base: abstract new (error: string) => DuploJSError<"common-asserts-error", string> & import('../kind').Kind<import('../kind').Handler<import('../kind').Definition<"@DuplojsLangCommon/duplojs-error-common-asserts-error", unknown>>, unknown>;
export declare class AssertsError extends AssertsError_base {
    value: unknown;
    constructor(value: unknown);
}
export declare function asserts<GenericInput extends unknown, GenericPredicate extends GenericInput>(input: GenericInput, predicate: (input: GenericInput) => input is GenericPredicate): asserts input is GenericPredicate;
export {};
