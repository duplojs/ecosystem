import * as DKind from '../kind';
export declare const createKind: <GenericName extends string, GenericKindValue extends unknown = unknown>(name: GenericName & import('../string').ForbiddenContain<GenericName, DKind.ForbiddenKindNameCharacter>) => DKind.Handler<DKind.Definition<`@DuplojsLangEither/${GenericName}`, GenericKindValue>>;
export declare const informationKind: DKind.Handler<DKind.Definition<"@DuplojsLangEither/information", string>>;
export declare const valueKind: DKind.Handler<DKind.Definition<"@DuplojsLangEither/value", unknown>>;
