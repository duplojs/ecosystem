import type * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import * as DStoTS from "@scripts/toTypescript";
import { Typescript } from "@scripts/typescript";
import type { DependenciesContext, MapContext, MapContextValue, StructureTransformer, StructureTransformerParams } from "./create";
import type { ConstraintTransformer } from "../constraintTransformer";
import type { TransformerHook } from "./hook";
import { createIdentifier } from "./createIdentifier";
import type { TransformerEither } from "../result";
import { constraintTransformer } from "../constraintTransformer/transformer";
import { createImportContext } from "./createImportContext";

export interface StructureTransformerFunctionParams {
	readonly structureTransformers: readonly StructureTransformer[];
	readonly constraintTransformers: readonly ConstraintTransformer[];

	readonly context: MapContext;
	readonly dependenciesContext: DependenciesContext;

	readonly importContext: DStoTS.MapImportContext;

	readonly hooks: readonly TransformerHook[];
	readonly recursiveDataStructures: readonly DDataStructure.Structure[];
	readonly keepIdentifier: boolean;

	readonly toTypescript: {
		readonly typeTransformers: readonly DStoTS.TypeTransformer[];
		readonly structureTransformers: readonly DStoTS.StructureTransformer[];
		readonly constraintTransformers: readonly DStoTS.ConstraintTransformer[];

		readonly context: DStoTS.MapContext;
		readonly importContext: DStoTS.MapImportContext;
	};
}

export function structureTransformer(
	structure: DDataStructure.Structure,
	params: StructureTransformerFunctionParams,
): TransformerEither {
	const currentStructure = DArray.reduce(
		params.hooks,
		DArray.reduceFrom< DDataStructure.Structure>(structure),
		({ element: hook, lastValue, next, exit }) => {
			const result = hook({
				structure: lastValue,
				context: params.context,
				importContext: params.importContext,
				output: (action, structure) => ({
					structure,
					action,
				}),
			});

			if (result.action === "stop") {
				return exit(result.structure);
			} else {
				return next(result.structure);
			}
		},
	);

	if (currentStructure.definition.identifier) {
		params.dependenciesContext.add(currentStructure);
	}

	const identifiedStructure = params.context.get(currentStructure);

	if (identifiedStructure) {
		return DEither.right(
			"buildSuccess",
			identifiedStructure.identifier,
		);
	}

	const newIdentifiedStructure = DCommon.justExec(() => {
		const currentIdentifier = DArray.includes(params.recursiveDataStructures, currentStructure)
		|| !!currentStructure.definition.identifier
			? Typescript.factory.createIdentifier(
				currentStructure.definition.identifier !== undefined
					? createIdentifier(currentStructure.definition.identifier)
					: `recursive${params.context.size}DataStructure`,
			)
			: undefined;

		if (!currentIdentifier) {
			return null;
		}

		const contextValue: MapContextValue = {
			identifier: currentIdentifier,
			expression: Typescript.factory.createIdentifier("undefined"),
			typeIdentifier: null,
			dependencies: new Set(),
			import: createImportContext(),
		};

		params.context.set(
			currentStructure,
			contextValue,
		);

		return contextValue;
	});

	const importContext = newIdentifiedStructure?.import
			?? params.importContext;

	const structureTransformerParams: StructureTransformerParams = {
		success: (result) => DEither.right("buildSuccess", result),
		transformer: (structure) => structureTransformer(
			structure,
			{
				...params,
				dependenciesContext: newIdentifiedStructure?.dependencies
						?? params.dependenciesContext,
				importContext,
			},
		),
		transformConstraint: DCommon.innerPipe(
			DArray.coalescing,
			DArray.reduce(
				DArray.reduceFrom<(Typescript.CallExpression | Typescript.Identifier)[]>([]),
				({
					element: constraint,
					nextPush,
					exit,
					lastValue,
				}) => DCommon.pipe(
					constraintTransformer(
						constraint,
						{
							transformers: params.constraintTransformers,
							importContext,
						},
					),
					DEither.whenIsRightOtherwise(
						(value) => nextPush(lastValue, value),
						exit,
					),
				),
			),
		),
		buildError: () => DEither.left("buildDataStructureError", currentStructure),
		addImport: DStoTS.createAddImport(importContext),
		context: params.context,
		importContext,
	};

	if (currentStructure.definition.mapImportContextEntries) {
		DStoTS.applyMapImportContextEntries(
			structureTransformerParams.addImport,
			currentStructure.definition.mapImportContextEntries,
		);
	}

	const result = currentStructure.definition.overrideDataStructureTransformer
		? currentStructure.definition.overrideDataStructureTransformer(
			currentStructure.addOverrideDataStructureTransformer(null),
			structureTransformerParams,
		)
		: DArray.reduce(
			params.structureTransformers,
			DArray.reduceFrom<TransformerEither>(
				DEither.left("dataStructureNotSupport", currentStructure),
			),
			({
				element: functionBuilder,
				lastValue,
				next,
				exit,
			}) => {
				const result = functionBuilder(currentStructure, structureTransformerParams);

				if (DEither.isLeft(result)) {
					if (
						DEither.hasInformation(result, [
							"buildDataStructureError",
							"buildConstraintError",
							"constraintNotSupport",
						])
					) {
						return exit(result);
					}

					return next(lastValue);
				}

				return exit(result);
			},
		);

	if (DEither.isLeft(result)) {
		return result;
	}

	if (newIdentifiedStructure) {
		const typeIdentifier = DCommon.justExec(() => {
			if (!DArray.includes(params.recursiveDataStructures, currentStructure)) {
				return null;
			}
			const identifier = `$${newIdentifiedStructure.identifier.text}`;

			const result = DStoTS.buildContext(
				currentStructure,
				{
					identifier,
					...params.toTypescript,
				},
			);

			return DEither.whenIsSelectedOtherwise(
				result,
				{
					buildSuccess: true,
					buildConstraintError: false,
					buildDataStructureError: false,
					constraintNotSupport: false,
					dataStructureNotSupport: false,
				},
				() => Typescript.factory.createIdentifier(identifier),
				() => DEither.left("buildDataStructureError", structure),
			);
		});

		if (DEither.isLeft(typeIdentifier)) {
			return typeIdentifier;
		}

		params.context.delete(currentStructure);

		params.context.set(
			currentStructure,
			{
				...newIdentifiedStructure,
				expression: DEither.unwrapRight(result),
				typeIdentifier: typeIdentifier,
			},
		);

		return DEither.right(
			"buildSuccess",
			newIdentifiedStructure.identifier,
		);
	}

	return result;
}
