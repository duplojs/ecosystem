import * as DKind from "@duplojs-v1/lang/kind";
export declare const createKind: <GenericName extends string, GenericKindValue extends unknown = unknown>(name: GenericName & import('@duplojs-v1/lang/string').ForbiddenContain<GenericName, DKind.ForbiddenKindNameCharacter>) => DKind.Handler<DKind.Definition<`@DuplojsVueForm/${GenericName}`, GenericKindValue>>;
