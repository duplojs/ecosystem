import * as DModeling from "@duplojs/lang/modeling";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import { StructureFinder } from "@scripts";

describe("entityStructureResearcher", () => {
	it("finds the wrapped object structure", () => {
		const root = DModeling.createEntity(
			"User",
			() => ({
				id: DModeling.createNewType("UserId", DDataStructure.string()),
			}),
		);

		const result = StructureFinder.structureFinder(
			root,
			(value) => value === root.definition.inner.value,
			{
				researchers: [StructureFinder.entityStructureResearcher],
				continueAfterMatch: true,
			},
		);

		expect(result).toStrictEqual([root.definition.inner.value]);
	});
});
