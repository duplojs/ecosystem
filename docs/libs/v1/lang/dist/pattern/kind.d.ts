import * as DKind from '../kind';
export declare const createKind: <GenericName extends string, GenericKindValue extends unknown = unknown>(name: GenericName & import('../string').ForbiddenContain<GenericName, DKind.ForbiddenKindNameCharacter>) => DKind.Handler<DKind.Definition<`@DuplojsLangPattern/${GenericName}`, GenericKindValue>>;
export declare const patternResultKind: DKind.Handler<DKind.Definition<"@DuplojsLangPattern/result", unknown>>;
export declare const patternValueMaybeAllKind: DKind.Handler<DKind.Definition<"@DuplojsLangPattern/value-maybe-all", unknown>>;
