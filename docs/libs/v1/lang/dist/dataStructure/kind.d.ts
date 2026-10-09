import * as DKind from '../kind';
export declare const createKind: <GenericName extends string, GenericKindValue extends unknown = unknown>(name: GenericName & import('../string').ForbiddenContain<GenericName, DKind.ForbiddenKindNameCharacter>) => DKind.Handler<DKind.Definition<`@DuplojsLangDataStructure/${GenericName}`, GenericKindValue>>;
