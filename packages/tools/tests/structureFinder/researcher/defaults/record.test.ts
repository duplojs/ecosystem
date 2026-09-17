import * as DDataStructure from "@duplojs/lang/dataStructure";
import { StructureFinder } from "@scripts";

describe("recordStructureResearcher", () => {
	it("finds both key and value structures", () => {
		const key = DDataStructure.literal("targetKey").addIdentifier("Key");
		const value = DDataStructure.string().addIdentifier("Value");
		const root = DDataStructure.record(key, value);

		const result = StructureFinder.structureFinder(
			root,
			(structure) => !!structure.definition.identifier,
			{
				researchers: [StructureFinder.recordStructureResearcher],
				continueAfterMatch: true,
			},
		);

		expect(result).toStrictEqual([key, value]);
	});

	it("finds through nested record values", () => {
		const target = DDataStructure.string().addIdentifier("Target");
		const root = DDataStructure.record(
			DDataStructure.string(),
			DDataStructure.record(
				DDataStructure.string(),
				target,
			),
		);

		const result = StructureFinder.structureFinder(
			root,
			(structure) => !!structure.definition.identifier,
			{
				researchers: [StructureFinder.recordStructureResearcher],
				continueAfterMatch: true,
			},
		);

		expect(result).toStrictEqual([target]);
	});
});
