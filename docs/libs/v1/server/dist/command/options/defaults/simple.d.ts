import { Option } from '../base';
import { EligibleType, ForbiddenInvalidIdentifier } from '../../types';
import type * as DCommon from "@duplojs/lang/common";
import type * as DKind from "@duplojs/lang/kind";
import type * as DDataStructure from "@duplojs/lang/dataStructure";
export declare const simpleOptionKind: DKind.Handler<DKind.Definition<"@DuplojsServerCommand/command-simple-option", unknown>>;
export interface SimpleOption<GenericName extends string = string, GenericValue extends EligibleType = EligibleType> extends DCommon.Forward<Option<GenericName, GenericValue> & DKind.Kind<typeof simpleOptionKind>> {
    readonly dataStructure: DDataStructure.Structure<GenericValue>;
    readonly required: boolean;
}
export interface CreateSimpleOptionParams<GenericAliases extends readonly string[] = readonly string[]> {
    description?: string;
    aliases?: (GenericAliases & {
        readonly [Index in keyof GenericAliases]: ForbiddenInvalidIdentifier<GenericAliases[Index]>;
    });
    required?: boolean;
}
export declare const createOption: <GenericName extends string, GenericStructure extends DDataStructure.Structure<EligibleType>, GenericValue extends DDataStructure.StructureValue<GenericStructure>, const GenericAliases extends readonly string[] = readonly string[], const GenericParams extends CreateSimpleOptionParams<GenericAliases> = {}>(name: GenericName & ForbiddenInvalidIdentifier<GenericName>, dataStructure: GenericStructure, params?: GenericParams & CreateSimpleOptionParams<GenericAliases>) => SimpleOption<GenericName, (GenericValue | (DCommon.IsEqual<GenericParams["required"], true> extends true ? never : undefined))>;
