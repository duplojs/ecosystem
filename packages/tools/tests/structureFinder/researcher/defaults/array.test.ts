import * as DDataStructure from "@duplojs/lang/dataStructure";
import { StructureFinder } from "@scripts";

describe("arrayStructureResearcher", () => {
	it("finds through nested array element structures", () => {
		const target = DDataStructure.string().addIdentifier("Target");
		const root = DDataStructure.array(
			DDataStructure.array(target),
		);

		const result = StructureFinder.structureFinder(
			root,
			(value) => !!value.definition.identifier,
			{
				researchers: [StructureFinder.arrayStructureResearcher],
				continueAfterMatch: true,
			},
		);

		expect(result).toStrictEqual([target]);
	});
});
