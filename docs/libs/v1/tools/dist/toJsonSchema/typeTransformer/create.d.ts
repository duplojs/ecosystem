import { JsonSchema, SupportedVersions, DataStructureTypeTransformerEither, DataStructureTypeErrorEither, DataStructureTypeSuccessEither } from '../result';
import { JsonSchemaString, JsonSchemaStringLiteral, JsonSchemaNumber, JsonSchemaNumberLiteral, JsonSchemaBoolean, JsonSchemaBooleanLiteral, JsonSchemaBigint, JsonSchemaBigintLiteral, JsonSchemaFile, JsonSchemaUndefined, JsonSchemaNull } from './defaults';
import type * as DDataStructure from "@duplojs-v1/lang/dataStructure";
export type TypeJsonSchema = (JsonSchemaString | JsonSchemaStringLiteral | JsonSchemaNumber | JsonSchemaNumberLiteral | JsonSchemaBoolean | JsonSchemaBooleanLiteral | JsonSchemaBigint | JsonSchemaBigintLiteral | JsonSchemaFile | JsonSchemaUndefined | JsonSchemaNull);
export interface TypeTransformerParams {
    readonly version: SupportedVersions;
    success(schema: JsonSchema): DataStructureTypeSuccessEither;
    buildError(): DataStructureTypeErrorEither;
}
export type TypeTransformerBuildFunction<GenericType extends DDataStructure.Type = DDataStructure.Type> = (type: GenericType, constraints: readonly DDataStructure.Constraint<DDataStructure.TypeValue<GenericType>>[], params: TypeTransformerParams) => DataStructureTypeTransformerEither;
export type TypeTransformer = (type: DDataStructure.Type, constraints: readonly DDataStructure.Constraint[], params: TypeTransformerParams) => DataStructureTypeTransformerEither;
export declare function createTypeTransformer<GenericType extends DDataStructure.Type>(support: (type: DDataStructure.Type) => type is GenericType, builder: TypeTransformerBuildFunction<GenericType>): TypeTransformer;
