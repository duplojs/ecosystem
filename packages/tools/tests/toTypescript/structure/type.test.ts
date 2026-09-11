import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoTS } from "@scripts";

describe("typeStructureTransformer", () => {
	it("renders a wrapped type structure", () => {
		expect(DStoTS.render(DDataStructure.string([DDataStructure.minCharacters(3)]), {
			identifier: "Value",
			structureTransformers: DStoTS.defaultStructureTransformers,
			typeTransformers: DStoTS.defaultTypeTransformers,
			constraintTransformers: DStoTS.defaultConstraintTransformers,
		})).toMatchSnapshot();
	});

	it("propagates an unsupported inner type", () => {
		expect(() => DStoTS.render(DDataStructure.string(), {
			identifier: "Value",
			structureTransformers: DStoTS.defaultStructureTransformers,
			typeTransformers: [],
			constraintTransformers: DStoTS.defaultConstraintTransformers,
		})).toThrowErrorMatchingSnapshot();
	});

	it("with identifier structure", () => {
		const structure = DDataStructure.string()
			.addIdentifier("Test");

		expect(DStoTS.render(structure, {
			identifier: "Value",
			structureTransformers: DStoTS.defaultStructureTransformers,
			typeTransformers: DStoTS.defaultTypeTransformers,
			constraintTransformers: DStoTS.defaultConstraintTransformers,
		})).toMatchSnapshot();
	});
});
