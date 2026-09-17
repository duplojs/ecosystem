import type * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import type { Typescript } from "@scripts/typescript";
import type * as DStoTS from "@scripts/toTypescript";
import type { DataStructureTypeErrorEither, DataStructureTypeTransformerEither, TransformerSuccessEither } from "../result";

export interface TypeTransformerParams {
	readonly importContext: DStoTS.MapImportContext;

	success(result: Typescript.CallExpression | Typescript.Identifier): TransformerSuccessEither;

	buildError(): DataStructureTypeErrorEither;

	addImport(path: string, typeName: string, type?: DStoTS.ImportKind): void;
}

export type TypeTransformerBuildFunction<
	GenericType extends DDataStructure.Type = DDataStructure.Type,
> = (
	type: GenericType,
	params: TypeTransformerParams,
) => DataStructureTypeTransformerEither;

export type TypeTransformer = (
	type: DDataStructure.Types,
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
		params,
	) => support(type)
		? builder(
			type,
			params,
		)
		: DEither.left("dataStructureTypeNotSupport", type);
}
