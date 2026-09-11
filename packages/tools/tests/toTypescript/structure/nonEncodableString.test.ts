import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoTS } from "@scripts";

describe("nonEncodableStringStructureTransformer", () => {
	it("renders a non-encodable string structure", () => {
		expect(DStoTS.render(DDataStructure.NonEncodableStringStructure("value"), {
			identifier: "Value",
			structureTransformers: DStoTS.defaultStructureTransformers,
			typeTransformers: DStoTS.defaultTypeTransformers,
			constraintTransformers: DStoTS.defaultConstraintTransformers,
		})).toMatchSnapshot();
	});

	it("with identifier structure", () => {
		const structure = DDataStructure.NonEncodableStringStructure("value")
			.addIdentifier("Test");

		expect(DStoTS.render(structure, {
			identifier: "Value",
			structureTransformers: DStoTS.defaultStructureTransformers,
			typeTransformers: DStoTS.defaultTypeTransformers,
			constraintTransformers: DStoTS.defaultConstraintTransformers,
		})).toMatchSnapshot();
	});
});
