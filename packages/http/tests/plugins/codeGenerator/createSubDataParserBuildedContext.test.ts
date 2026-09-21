import * as DArray from "@duplojs/lang/array";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import { type DataStructureToDataStructure, type DataStructureToTypescript, Typescript } from "@duplojs/tools";
import { createSubStructureBuildedContext, type SubBuildedContext } from "@plugin-codeGenerator/createSubStructureBuildedContext";

describe("createSubStructureBuildedContext", () => {
	it("creates one isolated sub-context per data parser with inherited imports and relative dependencies", () => {
		const dependencyStructure = DDataStructure.string();
		const mainStructure = DDataStructure.object({
			value: dependencyStructure,
		});

		const buildedContext: DataStructureToDataStructure.BuildedContext = {
			context: new Map<DDataStructure.Structure, DataStructureToDataStructure.MapContextValue>([
				[
					mainStructure,
					{
						identifier: Typescript.factory.createIdentifier("mainStructure"),
						expression: Typescript.factory.createIdentifier("mainExpression"),
						typeIdentifier: Typescript.factory.createIdentifier("MainType"),
						dependencies: new Set([dependencyStructure]),
						import: new Map([
							[
								"@duplojs/lang/dataStructure",
								{
									namespace: ["DDataStructure"],
								},
							],
						]),
					},
				],
				[
					dependencyStructure,
					{
						identifier: Typescript.factory.createIdentifier("dependencyStructure"),
						expression: Typescript.factory.createIdentifier("dependencyExpression"),
						typeIdentifier: null,
						dependencies: new Set(),
						import: new Map([
							[
								"@duplojs/lang/dataStructure",
								{
									namespace: ["DDataStructure"],
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
		expect(result).toStrictEqual([
			{
				identifier: "mainStructure",
				context: new Map([
					[
						mainStructure,
						{
							identifier: Typescript.factory.createIdentifier("mainStructure"),
							expression: Typescript.factory.createIdentifier("mainExpression"),
							typeIdentifier: Typescript.factory.createIdentifier("MainType"),
							dependencies: new Set([dependencyStructure]),
							import: new Map([
								[
									"@duplojs/lang/dataStructure",
									{
										namespace: ["DDataStructure"],
									},
								],
								[
									"./dependencyStructure",
									{
										direct: ["dependencyStructure"],
									},
								],
								[
									"./types",
									{
										direct: ["MainType"],
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
			},
			{
				identifier: "dependencyStructure",
				context: new Map([
					[
						dependencyStructure,
						{
							identifier: Typescript.factory.createIdentifier("dependencyStructure"),
							expression: Typescript.factory.createIdentifier("dependencyExpression"),
							typeIdentifier: null,
							dependencies: new Set(),
							import: new Map([
								[
									"@duplojs/lang/dataStructure",
									{
										namespace: ["DDataStructure"],
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
			},
		] satisfies SubBuildedContext[]);
	});
});
