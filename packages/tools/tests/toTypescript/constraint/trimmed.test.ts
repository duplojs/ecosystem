import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoTS } from "@scripts";

describe("trimmedConstraintTransformer", () => {
	it("renders an trimmed constraint", () => {
		expect(DStoTS.render(DDataStructure.string([DDataStructure.trimmed()]), {
			identifier: "Value",
			structureTransformers: DStoTS.defaultStructureTransformers,
			typeTransformers: DStoTS.defaultTypeTransformers,
			constraintTransformers: DStoTS.defaultConstraintTransformers,
		})).toMatchSnapshot();
	});
});
