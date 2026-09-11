import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import type * as DStoTS from "@scripts/toTypescript";
import { Typescript } from "@scripts/typescript";
import { getRecursiveDataStructure } from "@scripts/utils";
import type { ConstraintTransformer } from "./constraintTransformer";
import { createIdentifier, structureTransformer, type DependenciesContext, type MapContext, type StructureTransformer, type TransformerHook, createImportContext } from "./structureTransformer";
import type { ConstraintErrorEither, ConstraintNotSupportedEither, DataStructureErrorEither, DataStructureNotSupportedEither } from "./result";

export interface BuildedContext {
	readonly context: MapContext;
	readonly keepIdentifier?: boolean;
	readonly toTypescript: {
		readonly context: DStoTS.MapContext;
		readonly importContext: DStoTS.MapImportContext;
	};
}

export interface BuildContextParams {
	readonly identifier: string;
	readonly structureTransformers: readonly StructureTransformer[];
	readonly constraintTransformers: readonly ConstraintTransformer[];

	readonly context?: MapContext;

	readonly hooks?: readonly TransformerHook[];
	readonly keepIdentifier?: boolean;

	readonly toTypescript: {
		readonly typeTransformers: readonly DStoTS.TypeTransformer[];
		readonly structureTransformers: readonly DStoTS.StructureTransformer[];
		readonly constraintTransformers: readonly DStoTS.ConstraintTransformer[];
		readonly context?: DStoTS.MapContext;
		readonly importContext?: DStoTS.MapImportContext;
	};
}

export function buildContext(
	structure: DDataStructure.Structure,
	params: BuildContextParams,
): (
	| DEither.Success<BuildedContext>
	| DataStructureNotSupportedEither
	| DataStructureErrorEither
	| ConstraintNotSupportedEither
	| ConstraintErrorEither
) {
	const context: MapContext = params.context ?? new Map();
	const importContext: DStoTS.MapImportContext = createImportContext();
	const dependenciesContext: DependenciesContext = new Set();

	const toTypescriptContext: DStoTS.MapContext = params.toTypescript.context ?? new Map();
	const toTypescriptImportContext: DStoTS.MapImportContext = params.toTypescript.importContext ?? new Map();

	const keepIdentifier = params.keepIdentifier ?? false;

	const result = structureTransformer(
		structure,
		{
			...params,
			context,
			importContext,
			hooks: params.hooks ?? [],
			recursiveDataStructures: getRecursiveDataStructure(structure),
			dependenciesContext,
			keepIdentifier,
			toTypescript: {
				...params.toTypescript,
				context: toTypescriptContext,
				importContext: toTypescriptImportContext,
			},
		},
	);

	if (DEither.isLeft(result)) {
		return result;
	}

	if (!structure.definition.identifier) {
		context.set(
			DDataStructure.undefined(),
			{
				identifier: Typescript.factory.createIdentifier(createIdentifier(params.identifier)),
				expression: DEither.unwrapRight(result),
				typeIdentifier: null,
				dependencies: dependenciesContext,
				import: importContext,
			},
		);
	} else if (structure.definition.identifier !== params.identifier) {
		dependenciesContext.add(structure);

		context.set(
			DDataStructure.undefined(),
			{
				identifier: Typescript.factory.createIdentifier(createIdentifier(params.identifier)),
				expression: Typescript.factory.createIdentifier(createIdentifier(structure.definition.identifier)),
				typeIdentifier: null,
				dependencies: dependenciesContext,
				import: importContext,
			},
		);
	}

	return DEither.success({
		context,
		importContext,
		keepIdentifier,
		toTypescript: {
			context: toTypescriptContext,
			importContext: toTypescriptImportContext,
		},
	});
}
