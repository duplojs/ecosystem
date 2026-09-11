import type * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import type { MapContext } from "../context";
import type { DataStructureErrorEither, JsonSchema, SupportedVersions, DataStructureTransformerEither, TransformerSuccessEither, DataStructureTypeTransformerEither } from "../result";
import type {
	JsonSchemaNewType,
	JsonSchemaArray,
	JsonSchemaObject,
	JsonSchemaRecord,
	JsonSchemaNonEncodableString,
	JsonSchemaEntity,
	JsonSchemaTaggedObject,
} from "./defaults";

export type StructureJsonSchema = (
	| JsonSchemaNewType
	| JsonSchemaArray
	| JsonSchemaObject
	| JsonSchemaRecord
	| JsonSchemaNonEncodableString
	| JsonSchemaEntity
	| JsonSchemaTaggedObject
);

export interface StructureTransformerParams {
	readonly context: MapContext;
	readonly version: SupportedVersions;

	transformer(structure: DDataStructure.Structure): DataStructureTransformerEither;

	success(result: JsonSchema): TransformerSuccessEither;

	buildError(): DataStructureErrorEither;

	transformType(
		type: DDataStructure.Type,
		constraints: readonly DDataStructure.Constraint[],
	): DataStructureTypeTransformerEither;
}

export type StructureTransformerBuildFunction<
	GenericStructure extends DDataStructure.Structure = DDataStructure.Structure,
> = (
	structure: GenericStructure,
	params: StructureTransformerParams,
) => DataStructureTransformerEither;

export type StructureTransformer = (
	structure: DDataStructure.Structure,
	params: StructureTransformerParams,
) => DataStructureTransformerEither;

export function createStructureTransformer<
	GenericStructure extends DDataStructure.Structure,
>(
	support: (
		structure: DDataStructure.Structure,
	) => structure is GenericStructure,
	builder: StructureTransformerBuildFunction<GenericStructure>,
): StructureTransformer {
	return (
		structure,
		params,
	) => support(structure)
		? builder(
			structure,
			params,
		)
		: DEither.left("dataStructureNotSupport", structure);
}
