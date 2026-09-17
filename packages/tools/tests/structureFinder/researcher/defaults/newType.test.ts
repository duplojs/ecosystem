import * as DModeling from "@duplojs/lang/modeling";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import { StructureFinder } from "@scripts";

describe("newTypeStructureResearcher", () => {
	it("finds the wrapped inner structure", () => {
		const target = DDataStructure.string().addIdentifier("Target");
		const root = DModeling.createNewType("Value", target);

		const result = StructureFinder.structureFinder(
			root,
			(value) => !!value.definition.identifier,
			{
				researchers: [StructureFinder.newTypeStructureResearcher],
				continueAfterMatch: true,
			},
		);

		expect(result).toStrictEqual([target]);
	});
});
