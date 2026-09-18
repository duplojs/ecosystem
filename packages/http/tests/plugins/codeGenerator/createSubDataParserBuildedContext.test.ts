import * as DArray from "@duplojs/lang/array";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import { type DataStructureToDataStructure, Typescript } from "@duplojs/tools";
import { createSubStructureBuildedContext } from "@plugin-codeGenerator/createSubStructureBuildedContext";

describe("createSubStructureBuildedContext", () => {
	it("creates one isolated sub-context per data parser with inherited imports and relative dependencies", () => {
		const dependencyStructure = DDataStructure.string();
		const mainStructure = DDataStructure.object({
			value: DDataStructure.number(),
		});

		const buildedContext: DataStructureToDataStructure.BuildedContext = {
			context: new Map([
				[
					mainStructure as never,
					{
						identifier: Typescript.factory.createIdentifier("MainParser"),
						expression: Typescript.factory.createIdentifier("mainExpression"),
						typeIdentifier: Typescript.factory.createIdentifier("MainType"),
						dependencies: new Set([dependencyStructure, DDataStructure.undefined()]),
						import: new Map([
							[
								"@duplojs/lang/structure",
								{
									namespace: ["DDataStructure"],
								},
							],
						]),
					},
				],
				[
					dependencyStructure as never,
					{
						identifier: Typescript.factory.createIdentifier("DependencyParser"),
						expression: Typescript.factory.createIdentifier("dependencyExpression"),
						typeIdentifier: null,
						dependencies: new Set([dependencyStructure]),
						import: new Map([
							[
								"@duplojs/lang/structure",
								{
									namespace: ["DDataStructure"],
								},
							],
							[
								"shared-package",
								{
									direct: ["SharedType"],
								},
							],
						]),
					},
				],
			]),
			toTypescript: {
				context: new Map(),
				importContext: new Map(),
			},
		};

		const result = DArray.from(createSubStructureBuildedContext(buildedContext));
		const mainSubContext = result.find((context) => context.identifier === "MainParser");
		const dependencySubContext = result.find((context) => context.identifier === "DependencyParser");

		expect(result).toHaveLength(2);
		expect(mainSubContext).toBeDefined();
		expect(dependencySubContext).toBeDefined();

		expect({
			identifier: mainSubContext!.identifier,
			context: DArray.from(mainSubContext!.context.entries()),
			importContext: DArray.from(mainSubContext!.toTypescript.importContext.entries()),
			typescriptContext: DArray.from(mainSubContext!.toTypescript.context.entries()),
		}).toStrictEqual({
			identifier: "MainParser",
			context: [
				[
					mainStructure,
					buildedContext.context.get(mainStructure as never),
				],
			],
			importContext: [
				[
					"@duplojs/lang/structure",
					{
						namespace: ["DDataStructure"],
					},
				],
				[
					"shared-package",
					{
						direct: ["SharedType"],
					},
				],
				[
					"./DependencyParser",
					{
						direct: ["DependencyParser"],
					},
				],
				[
					"./types",
					{
						direct: ["MainType"],
					},
				],
			],
			typescriptContext: [],
		});

		expect({
			identifier: dependencySubContext!.identifier,
			context: DArray.from(dependencySubContext!.context.entries()),
			importContext: DArray.from(mainSubContext!.toTypescript.importContext.entries()),
			typescriptContext: DArray.from(mainSubContext!.toTypescript.context.entries()),
		}).toStrictEqual({
			identifier: "DependencyParser",
			context: [
				[
					dependencyStructure,
					buildedContext.context.get(dependencyStructure as never),
				],
			],
			importContext: [
				[
					"@duplojs/lang/structure",
					{
						namespace: ["DDataStructure"],
					},
				],
				[
					"shared-package",
					{
						direct: ["SharedType"],
					},
				],
			],
			typescriptContext: [],
			importMode: "lite",
		});
	});
});
