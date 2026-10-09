import * as DKind from '../kind';
declare const AssertsError_base: DKind.KindClass<DKind.Handler<DKind.Definition<"@DuplojsLangCommon/asserts-error", unknown>>, ErrorConstructor>;
export declare class AssertsError extends AssertsError_base {
    value: unknown;
    constructor(value: unknown);
}
export declare function asserts<GenericInput extends unknown, GenericPredicate extends GenericInput>(input: GenericInput, predicate: (input: GenericInput) => input is GenericPredicate): asserts input is GenericPredicate;
export {};
