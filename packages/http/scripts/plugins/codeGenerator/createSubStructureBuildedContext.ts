import { type DataStructureToTypescript, type DataStructureToDataStructure } from "@duplojs/tools";
import * as DCommon from "@duplojs/lang/common";
import * as DGenerator from "@duplojs/lang/generator";

export interface SubBuildedContext extends DataStructureToDataStructure.BuildedContext {
	identifier: string;
}

export function createSubStructureBuildedContext(
	buildedContext: DataStructureToDataStructure.BuildedContext,
) {
	return DCommon.pipe(
		buildedContext.context.entries(),
		DGenerator.map(
			([structure, contextValue]): SubBuildedContext => {
				const subImportContext: DataStructureToTypescript.MapImportContext = new Map(
					contextValue.import,
				);

				DCommon.pipe(
					contextValue.dependencies,
					DGenerator.map(
						(structureDependencies) => {
							if (structure === structureDependencies) {
								return null;
							}
							const subContextValue = buildedContext.context.get(structureDependencies);
							if (!subContextValue) {
								return null;
							}

							subImportContext.set(`./${subContextValue.identifier.text}`, {
								direct: [subContextValue.identifier.text],
							});

							return null;
						},
					),
					DGenerator.execute,
				);

				if (contextValue.typeIdentifier) {
					subImportContext.set("./types", {
						direct: [contextValue.typeIdentifier.text],
					});
				}

				return {
					identifier: contextValue.identifier.text,
					context: new Map([
						[
							structure,
							{
								...contextValue,
								import: subImportContext,
							},
						],
					]),
					toTypescript: {
						context: new Map(),
						importContext: new Map(),
					},
				};
			},
		),
	);
}
