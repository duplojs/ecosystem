import * as DDataStructure from "@duplojs/lang/dataStructure";
import { StructureFinder } from "@scripts";

describe("unionStructureResearcher", () => {
	it("finds through nested union values", () => {
		const target = DDataStructure.string().addIdentifier("Target");
		const root = DDataStructure.union([
			DDataStructure.number(),
			DDataStructure.union([
				DDataStructure.boolean(),
				target,
			]),
		]);

		const result = StructureFinder.structureFinder(
			root,
			(value) => !!value.definition.identifier,
			{
				researchers: [StructureFinder.unionStructureResearcher],
				continueAfterMatch: true,
			},
		);

		expect(result).toStrictEqual([target]);
	});
});
