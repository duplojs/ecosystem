import { StructureJsonSchema } from './structureTransformer/create';
import { TypeJsonSchema } from './typeTransformer';
import type * as DDataStructure from "@duplojs-v1/lang/dataStructure";
import type * as DEither from "@duplojs-v1/lang/either";
export interface JsonSchemaRef {
    $ref: string;
}
export interface JsonSchemaAnyOf {
    anyOf: JsonSchema[];
}
export type JsonSchema = (JsonSchemaRef | JsonSchemaAnyOf | StructureJsonSchema | TypeJsonSchema);
export type DataStructureTypeSuccessEither = DEither.Right<"buildDataStructureTypeSuccess", JsonSchema>;
export type DataStructureTypeNotSupportedEither = DEither.Left<"dataStructureTypeNotSupport", DDataStructure.Type>;
export type DataStructureTypeErrorEither = DEither.Left<"buildDataStructureTypeError", DDataStructure.Type>;
export type DataStructureTypeTransformerEither = (DataStructureTypeSuccessEither | DataStructureTypeNotSupportedEither | DataStructureTypeErrorEither);
export type DataStructureSuccessEither = DEither.Right<"buildDataStructureSuccess", {
    readonly schema: JsonSchema;
    readonly isOptional: boolean;
}>;
export type DataStructureNotSupportedEither = DEither.Left<"dataStructureNotSupport", DDataStructure.Structure>;
export type DataStructureErrorEither = DEither.Left<"buildDataStructureError", DDataStructure.Structure>;
export type DataStructureTransformerEither = (DataStructureSuccessEither | DataStructureNotSupportedEither | DataStructureErrorEither | Extract<DataStructureTypeTransformerEither, DEither.Left>);
export declare const supportedVersions: {
    readonly jsonSchema4: "http://json-schema.org/draft-04/schema#";
    readonly jsonSchema7: "http://json-schema.org/draft-07/schema#";
    readonly jsonSchema202012: "https://json-schema.org/draft/2020-12/schema";
    readonly openApi3: "https://spec.openapis.org/oas/3.0.3";
    readonly openApi31: "https://spec.openapis.org/oas/3.1.0";
};
export type MapperSupportedVersions = typeof supportedVersions;
export type SupportedVersions = keyof typeof supportedVersions;
export type SupportedVersionsUrl = typeof supportedVersions[SupportedVersions];
