import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import { StructureFinder } from "@scripts";

describe("createResearcher", () => {
	it("narrows the researched structure when created with a type guard", () => {
		const target = DDataStructure.string().addIdentifier("Value");
		const researcher = StructureFinder.createResearcher(
			DDataStructure.structureIdentifier(DDataStructure.objectStructureKind),
			(structure, { find }) => {
				type _CheckStructure = DCommon.ExpectType<
					typeof structure,
					DDataStructure.ObjectStructure,
					"strict"
				>;

				find(target);
			},
		);
		const root = DDataStructure.object({ target });

		const result = StructureFinder.structureFinder(
			root,
			(value) => !!value.definition.identifier,
			{ researchers: [researcher] },
		);

		expect(result).toStrictEqual([target]);
	});

	it("does not execute the researcher when its predicate does not match", () => {
		const researcherCallback = vi.fn();
		const researcher = StructureFinder.createResearcher(
			DDataStructure.structureIdentifier(DDataStructure.objectStructureKind),
			researcherCallback,
		);

		const result = StructureFinder.structureFinder(
			DDataStructure.string(),
			() => false,
			{ researchers: [researcher] },
		);

		expect(result).toStrictEqual([]);
		expect(researcherCallback).not.toHaveBeenCalled();
	});
});
