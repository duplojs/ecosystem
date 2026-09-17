import * as DModeling from "@duplojs/lang/modeling";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import { StructureFinder } from "@scripts";

describe("taggedObjectStructureResearcher", () => {
	it("finds the wrapped object structure", () => {
		const root = DModeling.createTaggedObject(
			"Target",
			{
				name: DDataStructure.string(),
			},
		);

		const result = StructureFinder.structureFinder(
			root,
			(value) => value === root.definition.inner,
			{
				researchers: [StructureFinder.taggedObjectStructureResearcher],
				continueAfterMatch: true,
			},
		);

		expect(result).toStrictEqual([root.definition.inner]);
	});
});
