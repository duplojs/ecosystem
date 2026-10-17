import * as DKind from "@duplojs/lang/kind";
export declare const createKind: <GenericName extends string, GenericKindValue extends unknown = unknown>(name: GenericName & import('@duplojs/lang/string').ForbiddenContain<GenericName, DKind.ForbiddenKindNameCharacter>) => DKind.Handler<DKind.Definition<`@DuplojsHttpInterfacesBun/${GenericName}`, GenericKindValue>>;
