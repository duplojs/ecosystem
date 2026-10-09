import { MapContext } from '../context';
import { DataStructureErrorEither, JsonSchema, SupportedVersions, DataStructureTransformerEither, DataStructureSuccessEither, DataStructureTypeTransformerEither } from '../result';
import { JsonSchemaNewType, JsonSchemaArray, JsonSchemaObject, JsonSchemaRecord, JsonSchemaNonEncodableString, JsonSchemaEntity, JsonSchemaTaggedObject } from './defaults';
import type * as DDataStructure from "@duplojs-v1/lang/dataStructure";
export type StructureJsonSchema = (JsonSchemaNewType | JsonSchemaArray | JsonSchemaObject | JsonSchemaRecord | JsonSchemaNonEncodableString | JsonSchemaEntity | JsonSchemaTaggedObject);
export interface StructureTransformerParams {
    readonly context: MapContext;
    readonly version: SupportedVersions;
    transformer(structure: DDataStructure.Structure): DataStructureTransformerEither;
    success(schema: JsonSchema): DataStructureSuccessEither;
    buildError(): DataStructureErrorEither;
    transformType(type: DDataStructure.Type, constraints: readonly DDataStructure.Constraint[]): DataStructureTypeTransformerEither;
}
export type StructureTransformerBuildFunction<GenericStructure extends DDataStructure.Structure = DDataStructure.Structure> = (structure: GenericStructure, params: StructureTransformerParams) => DataStructureTransformerEither;
export type StructureTransformer = (structure: DDataStructure.Structure, params: StructureTransformerParams) => DataStructureTransformerEither;
export declare function createStructureTransformer<GenericStructure extends DDataStructure.Structure>(support: (structure: DDataStructure.Structure) => structure is GenericStructure, builder: StructureTransformerBuildFunction<GenericStructure>): StructureTransformer;
