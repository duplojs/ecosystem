import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import * as DArray from "@duplojs/lang/array";
import type { ConstraintTransformer } from "./constraintTransformer";
import type { MapContext } from "./context";
import type { TransformerHook } from "./hook";
import type { MapImportContext } from "./importContext";
import type { ConstraintErrorEither, ConstraintNotSupportedEither, DataStructureErrorEither, DataStructureNotSupportedEither } from "./result";
import type { StructureTransformer } from "./structureTransformer";
import { transformer } from "./transformer";
import type { TypeTransformer } from "./typeTransformer";
import { getRecursiveDataStructure } from "@scripts/utils";
import { Typescript } from "@scripts/typescript";
import { createIdentifier } from "./createIdentifier";

export interface BuiltContext {
	readonly context: MapContext;
	readonly importContext: MapImportContext;
}

export interface BuildContextParams {
	readonly identifier: string;
	readonly structureTransformers: readonly StructureTransformer[];
	readonly typeTransformers: readonly TypeTransformer[];
	readonly constraintTransformers: readonly ConstraintTransformer[];
	readonly context?: MapContext;
	readonly importContext?: MapImportContext;
	readonly hooks?: readonly TransformerHook[];
}

export function buildContext(
	structure: DDataStructure.Structure,
	params: BuildContextParams,
): (
	| DEither.Right<"buildSuccess", BuiltContext>
	| DataStructureNotSupportedEither
	| DataStructureErrorEither
	| ConstraintNotSupportedEither
	| ConstraintErrorEither
) {
	const context: MapContext = params.context ?? new Map();
	const importContext: MapImportContext = params.importContext ?? new Map();
	const result = transformer(
		structure,
		{
			identifier: params.identifier,
			structureTransformers: params.structureTransformers,
			typeTransformers: params.typeTransformers,
			constraintTransformers: params.constraintTransformers,
			context,
			importContext,
			recursiveDataStructures: getRecursiveDataStructure(structure),
			hooks: params.hooks ?? [],
		},
	);

	if (DEither.isLeft(result)) {
		return result;
	}

	const rootIdentifier = createIdentifier(params.identifier);
	const rootResult = DEither.unwrapRight(result);

	const rootResultAlreadyDeclared = DArray.some(
		DArray.from(context.values()),
		(declaration) => declaration.name.text === rootIdentifier,
	)
		&& Typescript.isTypeReferenceNode(rootResult)
		&& Typescript.isIdentifier(rootResult.typeName)
		&& rootResult.typeName.text === rootIdentifier;

	if (
		!structure.definition.identifier
		&& !rootResultAlreadyDeclared
	) {
		context.set(
			DDataStructure.undefined(),
			Typescript.factory.createTypeAliasDeclaration(
				[Typescript.factory.createToken(Typescript.SyntaxKind.ExportKeyword)],
				Typescript.factory.createIdentifier(rootIdentifier),
				undefined,
				rootResult,
			),
		);
	} else if (
		structure.definition.identifier !== undefined
		&& structure.definition.identifier !== params.identifier
	) {
		context.set(
			DDataStructure.undefined(),
			Typescript.factory.createTypeAliasDeclaration(
				[Typescript.factory.createToken(Typescript.SyntaxKind.ExportKeyword)],
				Typescript.factory.createIdentifier(rootIdentifier),
				undefined,
				Typescript.factory.createTypeReferenceNode(
					createIdentifier(structure.definition.identifier),
				),
			),
		);
	}

	return DEither.right(
		"buildSuccess",
		{
			context,
			importContext,
		},
	);
}
