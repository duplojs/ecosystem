import * as DDataStructure from "@duplojs/lang/dataStructure";
import { StructureFinder } from "@scripts";

describe("objectStructureResearcher", () => {
	it("finds through nested object properties", () => {
		const target = DDataStructure.string().addIdentifier("Target");
		const root = DDataStructure.object({
			nested: DDataStructure.object({
				target,
			}),
		});

		const result = StructureFinder.structureFinder(
			root,
			(value) => !!value.definition.identifier,
			{
				researchers: [StructureFinder.objectStructureResearcher],
				continueAfterMatch: true,
			},
		);

		expect(result).toStrictEqual([target]);
	});
});
