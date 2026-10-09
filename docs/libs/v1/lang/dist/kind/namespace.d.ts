import { Definition, Handler, ForbiddenKindNameCharacter } from './base';
import type * as DString from '../string';
export declare function createNamespace<GenericNamespace extends string>(namespace: (GenericNamespace & DString.ForbiddenContain<GenericNamespace, ForbiddenKindNameCharacter>)): <GenericName extends string, GenericKindValue extends unknown = unknown>(name: (GenericName & DString.ForbiddenContain<GenericName, ForbiddenKindNameCharacter>)) => Handler<Definition<`@${GenericNamespace}/${GenericName}`, GenericKindValue>>;
