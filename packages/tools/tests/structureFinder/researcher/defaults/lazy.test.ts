import * as DDataStructure from "@duplojs/lang/dataStructure";
import { StructureFinder } from "@scripts";

describe("lazyStructureResearcher", () => {
	it("finds through nested lazy getters", () => {
		const target = DDataStructure.string().addIdentifier("Target");
		const nestedLazy = DDataStructure.lazy(() => target);
		const root = DDataStructure.lazy(() => nestedLazy);

		const result = StructureFinder.structureFinder(
			root,
			(value) => !!value.definition.identifier,
			{
				researchers: [StructureFinder.lazyStructureResearcher],
				continueAfterMatch: true,
			},
		);

		expect(result).toStrictEqual([target]);
	});
});
