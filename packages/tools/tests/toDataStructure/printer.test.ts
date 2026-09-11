import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoDS, Typescript } from "@scripts";

describe("toDataStructure printer", () => {
	it("prints a typed data structure declaration and ignores empty import kinds", () => {
		const context: DStoDS.MapContext = new Map<DDataStructure.Structure, DStoDS.MapContextValue>([
			[
				DDataStructure.undefined(),
				{
					identifier: Typescript.factory.createIdentifier("recursiveDataStructure"),
					expression: Typescript.factory.createIdentifier("undefined"),
					typeIdentifier: Typescript.factory.createIdentifier("$recursiveDataStructure"),
					dependencies: new Set(),
					import: new Map([
						[
							"@duplojs/lang/dataStructure",
							{
								namespace: ["DDataStructure"],
								direct: undefined,
							},
						],
					]),
				},
			],
			[
				DDataStructure.null(),
				{
					identifier: Typescript.factory.createIdentifier("nullableDataStructure"),
					expression: Typescript.factory.createIdentifier("null"),
					typeIdentifier: null,
					dependencies: new Set(),
					import: new Map(),
				},
			],
		]);

		expect(DStoDS.printer({
			context,
			toTypescript: {
				context: new Map(),
				importContext: new Map(),
			},
		})).toBe(
			[
				"import * as DDataStructure from \"@duplojs/lang/dataStructure\";",
				"",
				"export const recursiveDataStructure: DDataStructure.Structure<$recursiveDataStructure, unknown> = undefined;",
				"",
				"export const nullableDataStructure = null;",
			].join("\n"),
		);
	});
});
