import { Option } from '../base';
import { EligibleType } from '../../types';
import type * as DCommon from "@duplojs-v1/lang/common";
import type * as DKind from "@duplojs-v1/lang/kind";
import type * as DDataStructure from "@duplojs-v1/lang/dataStructure";
export declare const simpleOptionKind: DKind.Handler<DKind.Definition<"@DuplojsServerCommand/command-simple-option", unknown>>;
export interface SimpleOption<GenericName extends string = string, GenericValue extends EligibleType = EligibleType> extends DCommon.Forward<Option<GenericName, GenericValue> & DKind.Kind<typeof simpleOptionKind>> {
    readonly dataStructure: DDataStructure.Structure<GenericValue>;
    readonly required: boolean;
}
export interface CreateSimpleOptionParams {
    description?: string;
    aliases?: readonly string[];
    required?: boolean;
}
export declare const createOption: <GenericName extends string, GenericStructure extends DDataStructure.Structure<EligibleType>, GenericValue extends DDataStructure.StructureValue<GenericStructure>, const GenericParams extends CreateSimpleOptionParams = {}>(name: GenericName, dataStructure: GenericStructure, params?: GenericParams & CreateSimpleOptionParams) => SimpleOption<GenericName, (GenericValue | (DCommon.IsEqual<GenericParams["required"], true> extends true ? never : undefined))>;
