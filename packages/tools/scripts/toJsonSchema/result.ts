import type * as DDataStructure from "@duplojs/lang/dataStructure";
import type * as DEither from "@duplojs/lang/either";
import type { StructureJsonSchema } from "./structureTransformer/create";
import type { TypeJsonSchema } from "./typeTransformer";

export interface JsonSchemaRef {
	$ref: string;
}

export interface JsonSchemaAnyOf {
	anyOf: JsonSchema[];
}

export type JsonSchema = (
	| JsonSchemaRef
	| JsonSchemaAnyOf
	| StructureJsonSchema
	| TypeJsonSchema
);

export type TransformerSuccessEither = DEither.Right<
	"buildSuccess",
	JsonSchema
>;

export type DataStructureTypeNotSupportedEither = DEither.Left<
	"dataStructureTypeNotSupport",
	DDataStructure.Type
>;

export type DataStructureTypeErrorEither = DEither.Left<
	"buildDataStructureTypeError",
	DDataStructure.Type
>;

export type DataStructureTypeTransformerEither = (
	| TransformerSuccessEither
	| DataStructureTypeNotSupportedEither
	| DataStructureTypeErrorEither
);

export type DataStructureNotSupportedEither = DEither.Left<
	"dataStructureNotSupport",
	DDataStructure.Structure
>;

export type DataStructureErrorEither = DEither.Left<
	"buildDataStructureError",
	DDataStructure.Structure
>;

export type DataStructureTransformerEither = (
	| TransformerSuccessEither
	| DataStructureNotSupportedEither
	| DataStructureErrorEither
);

export const supportedVersions = {
	jsonSchema4: "http://json-schema.org/draft-04/schema#",
	jsonSchema7: "http://json-schema.org/draft-07/schema#",
	jsonSchema202012: "https://json-schema.org/draft/2020-12/schema",
	openApi3: "https://spec.openapis.org/oas/3.0.3",
	openApi31: "https://spec.openapis.org/oas/3.1.0",
} as const;

export type MapperSupportedVersions = typeof supportedVersions;
export type SupportedVersions = keyof typeof supportedVersions;
export type SupportedVersionsUrl = typeof supportedVersions[SupportedVersions];
