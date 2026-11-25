import { Option } from '../base';
import { ForbiddenInvalidIdentifier } from '../../types';
import type * as DCommon from "@duplojs/lang/common";
import type * as DKind from "@duplojs/lang/kind";
export declare const booleanOptionKind: DKind.Handler<DKind.Definition<"@DuplojsServerCommand/command-boolean-option", unknown>>;
export interface BooleanOption<GenericName extends string = string> extends DCommon.Forward<Option<GenericName, boolean> & DKind.Kind<typeof booleanOptionKind>> {
}
export interface CreateBooleanOptionParams<GenericAliases extends readonly string[] = readonly string[]> {
    description?: string;
    aliases?: (GenericAliases & {
        readonly [Index in keyof GenericAliases]: ForbiddenInvalidIdentifier<GenericAliases[Index]>;
    });
}
export declare function createBooleanOption<GenericName extends string, const GenericAliases extends readonly string[] = readonly string[]>(name: GenericName & ForbiddenInvalidIdentifier<GenericName>, params?: CreateBooleanOptionParams<GenericAliases>): BooleanOption<GenericName>;
