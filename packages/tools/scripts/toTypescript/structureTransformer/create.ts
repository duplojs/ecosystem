import type * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import type { Typescript } from "@scripts/typescript";
import type { MapContext } from "../context";
import type { ImportKind, MapImportContext } from "../importContext";
import type { ConstraintTransformerEither, DataStructureErrorEither, DataStructureTypeTransformerEither, TransformerEither, TransformerSuccessEither } from "../result";

export interface StructureTransformerParams {
	readonly context: MapContext;
	readonly importContext: MapImportContext;

	transformer(
		structure: DDataStructure.Structure,
	): TransformerEither;

	success(result: Typescript.TypeNode): TransformerSuccessEither;

	transformType(
		type: DDataStructure.Type
	): DataStructureTypeTransformerEither;

	transformConstraint(
		constraint: DDataStructure.Constraint,
	): ConstraintTransformerEither;

	buildError(): DataStructureErrorEither;

	addImport(path: string, typeName: string, type?: ImportKind): void;
}

export type StructureTransformerBuildFunction<
	GenericStructure extends DDataStructure.Structure = DDataStructure.Structure,
> = (
	structure: GenericStructure,
	params: StructureTransformerParams,
) => TransformerEither;

export type StructureTransformer = (
	structure: DDataStructure.Structure,
	params: StructureTransformerParams,
) => TransformerEither;

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
