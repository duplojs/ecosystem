import { DataStructureToTypescript, DataStructureToDataStructure, StructureFinder } from "@duplojs/tools";
import { type HubPlugin } from "@core/hub";
import * as DCommon from "@duplojs/lang/common";
import * as DArray from "@duplojs/lang/array";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import * as DGenerator from "@duplojs/lang/generator";
import { routeToStructure } from "./routeToStructure";
import * as DSFile from "@duplojs/server/file";
import { typescriptTypeTransformers } from "./typescriptTransformer";
import { structureHasIdentifier, findIdentifiedStructureInSteps } from "./findIdentifiedStructureInSteps";
import { type Route } from "@core/route";
import { createSubStructureBuildedContext } from "./createSubStructureBuildedContext";
import * as DPath from "@duplojs/lang/path";
import * as DString from "@duplojs/lang/string";

export interface GenerateStructureParams {
	outputFolder: string & DPath.Path;
	disabledFromRoute?: boolean;
	structures?: DDataStructure.Structure[];
}

export interface CodeGeneratorPluginParams {
	outputFile: string & DPath.Path;
	generateStructure?: GenerateStructureParams;
}

export function codeGeneratorPlugin(pluginParams: CodeGeneratorPluginParams) {
	return (): HubPlugin => ({
		name: "code-generator",
		hooksHubLifeCycle: [
			{
				beforeStartServer: async(hub) => {
					if (!DCommon.equal(hub.config.environment, ["DEV", "BUILD"])) {
						return;
					}

					const structureRoutes = DCommon.pipe(
						hub.routes,
						DGenerator.map((route) => routeToStructure(route, {
							defaultExtractContract: hub.defaultExtractContract,
						})),
						DGenerator.flat,
						DArray.from,
					);

					if (!DArray.minElements(structureRoutes, 1)) {
						return;
					}

					const output = DataStructureToTypescript.render(
						DDataStructure.union(
							DCommon.cast(structureRoutes) satisfies DCommon.AnyTuple<DDataStructure.Structure>,
						),
						{
							identifier: "Routes",
							typeTransformers: typescriptTypeTransformers,
							constraintTransformers: DataStructureToTypescript.defaultConstraintTransformers,
							structureTransformers: DataStructureToTypescript.defaultStructureTransformers,
						},
					);

					DCommon.asserts(
						await DSFile.writeTextFile(pluginParams.outputFile, output),
						DEither.isRight,
					);

					if (pluginParams.generateStructure) {
						const generateStructureParams = pluginParams.generateStructure;

						const buildedContext: DataStructureToDataStructure.BuildedContext = {
							context: new Map(),
							toTypescript: {
								context: new Map(),
								importContext: new Map(),
							},
						};
						const ignoreStructure = new Set<DDataStructure.Structure>();

						DCommon.pipe(
							[],
							DArray.concat(
								DCommon.pipe(
									generateStructureParams.structures ?? [],
									DArray.flatMap(
										(structure) => StructureFinder.structureFinder(
											structure,
											structureHasIdentifier,
											{
												researchers: StructureFinder.defaultResearchers,
												ignore: ignoreStructure,
											},
										),
									),
								),
							),
							DArray.concat(
								DCommon.pipe(
									generateStructureParams.disabledFromRoute
										? new Set<Route>()
										: hub.routes,
									DGenerator.map(
										(route) => findIdentifiedStructureInSteps(
											route.definition.steps,
											{ ignoreStructure },
										),
									),
									DGenerator.flat,
									DArray.from,
								),
							),
							DArray.map(
								(structure) => DataStructureToDataStructure.buildContext(
									structure,
									{
										identifier: structure.definition.identifier,
										constraintTransformers:
											DataStructureToDataStructure.defaultConstraintTransformers,
										structureTransformers:
											DataStructureToDataStructure.defaultStructureTransformers,
										typeTransformers: DataStructureToDataStructure.defaultTypeTransformers,
										context: buildedContext.context,
										toTypescript: {
											typeTransformers: typescriptTypeTransformers,
											constraintTransformers:
												DataStructureToTypescript.defaultConstraintTransformers,
											structureTransformers:
												DataStructureToTypescript.defaultStructureTransformers,
											context: buildedContext.toTypescript.context,
											importContext: buildedContext.toTypescript.importContext,
										},
									},
								),
							),
						);

						await DCommon.asyncPipe(
							DSFile.exists(generateStructureParams.outputFolder),
							DEither.whenIsRight(
								async() => void DCommon.asserts(
									await DSFile.remove(
										generateStructureParams.outputFolder,
										{ recursive: true },
									),
									DEither.isRight,
								),
							),
							async() => void DCommon.asserts(
								await DSFile.makeDirectory(generateStructureParams.outputFolder),
								DEither.isRight,
							),
						);

						DCommon.asserts(
							await DSFile.writeTextFile(
								DPath.resolveRelative([
									generateStructureParams.outputFolder,
									DCommon.cast("types.ts"),
								]),
								DataStructureToTypescript.printer(
									buildedContext.toTypescript,
								),
							),
							DEither.isRight,
						);

						for (const context of createSubStructureBuildedContext(buildedContext)) {
							DCommon.asserts(
								await DSFile.writeTextFile(
									DPath.resolveRelative([
										generateStructureParams.outputFolder,
										DPath.createOrThrow(`${context.identifier}.ts`),
									]),
									DataStructureToDataStructure.printer(
										context,
									),
								),
								DEither.isRight,
							);
						}

						await DCommon.pipe(
							buildedContext.context.values(),
							DGenerator.map((contextValue): string => `export * from "./${contextValue.identifier.text}";`),
							DArray.from,
							DString.join("\n"),
							async(values) => {
								DCommon.asserts(
									await DSFile.writeTextFile(
										DPath.resolveRelative([
											generateStructureParams.outputFolder,
											DCommon.cast("index.ts"),
										]),
										values,
									),
									DEither.isRight,
								);
							},
						);
					}
				},
			},
		],
	});
}
