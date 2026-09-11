import type * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import type { JsonSchema, SupportedVersions, TransformerSuccessEither, DataStructureTypeTransformerEither, DataStructureTypeErrorEither } from "../result";
import type {
	JsonSchemaString,
	JsonSchemaStringLiteral,
	JsonSchemaNumber,
	JsonSchemaNumberLiteral,
	JsonSchemaBoolean,
	JsonSchemaBooleanLiteral,
	JsonSchemaBigint,
	JsonSchemaBigintLiteral,
	JsonSchemaUndefined,
	JsonSchemaNull,
} from "./defaults";

export type TypeJsonSchema = (
	| JsonSchemaString
	| JsonSchemaStringLiteral
	| JsonSchemaNumber
	| JsonSchemaNumberLiteral
	| JsonSchemaBoolean
	| JsonSchemaBooleanLiteral
	| JsonSchemaBigint
	| JsonSchemaBigintLiteral
	| JsonSchemaUndefined
	| JsonSchemaNull
);

export interface TypeTransformerParams {
	readonly version: SupportedVersions;

	success(result: JsonSchema): TransformerSuccessEither;

	buildError(): DataStructureTypeErrorEither;
}

export type TypeTransformerBuildFunction<
	GenericType extends DDataStructure.Type = DDataStructure.Type,
> = (
	type: GenericType,
	constraints: readonly DDataStructure.Constraint<
		DDataStructure.TypeValue<GenericType>
	>[],
	params: TypeTransformerParams,
) => DataStructureTypeTransformerEither;

export type TypeTransformer = (
	type: DDataStructure.Type,
	constraints: readonly DDataStructure.Constraint[],
	params: TypeTransformerParams,
) => DataStructureTypeTransformerEither;

export function createTypeTransformer<
	GenericType extends DDataStructure.Type,
>(
	support: (
		type: DDataStructure.Type,
	) => type is GenericType,
	builder: TypeTransformerBuildFunction<GenericType>,
): TypeTransformer {
	return (
		type,
		constraints,
		params,
	) => support(type)
		? builder(
			type,
			constraints,
			params,
		)
		: DEither.left("dataStructureTypeNotSupport", type);
}
