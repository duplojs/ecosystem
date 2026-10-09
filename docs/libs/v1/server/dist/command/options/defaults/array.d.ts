import { Option } from '../base';
import { EligibleType } from '../../types';
import * as DCommon from "@duplojs-v1/lang/common";
import type * as DKind from "@duplojs-v1/lang/kind";
import * as DDataStructure from "@duplojs-v1/lang/dataStructure";
import type * as DNumber from "@duplojs-v1/lang/number";
import type * as DArray from "@duplojs-v1/lang/array";
export declare const arrayOptionKind: DKind.Handler<DKind.Definition<"@DuplojsServerCommand/command-array-option", unknown>>;
export interface ArrayOption<GenericName extends string = string, GenericValue extends (readonly EligibleType[] | undefined) = (readonly EligibleType[] | undefined)> extends DCommon.Forward<Option<GenericName, GenericValue> & DKind.Kind<typeof arrayOptionKind>> {
    readonly dataStructure: DDataStructure.Structure<GenericValue>;
    readonly required: boolean;
    readonly separator: string;
    readonly min?: number;
    readonly max?: number;
}
export interface CreateArrayOptionParams {
    description?: string;
    aliases?: readonly string[];
    min?: number;
    max?: number;
    required?: boolean;
    separator?: string;
}
export declare const createArrayOption: <GenericName extends string, GenericStructure extends DDataStructure.Structure<EligibleType>, GenericValue extends DDataStructure.StructureValue<GenericStructure>, const GenericParams extends CreateArrayOptionParams = {}>(name: GenericName, dataStructure: GenericStructure, params?: GenericParams & CreateArrayOptionParams) => ArrayOption<GenericName, ((readonly GenericValue[] & (DNumber.IsLiteral<Extract<GenericParams["min"], number>> extends true ? DArray.MinElements<Extract<GenericParams["min"], number>> : unknown) & (DNumber.IsLiteral<Extract<GenericParams["max"], number>> extends true ? DArray.MaxElements<Extract<GenericParams["max"], number>> : unknown)) | (DCommon.IsEqual<GenericParams["required"], true> extends true ? never : undefined))>;
