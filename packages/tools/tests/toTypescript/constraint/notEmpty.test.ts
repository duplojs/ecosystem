import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoTS } from "@scripts";

describe("notEmptyConstraintTransformer", () => {
	it("renders a not-empty constraint", () => {
		expect(DStoTS.render(DDataStructure.string([DDataStructure.notEmpty()]), {
			identifier: "Value",
			structureTransformers: DStoTS.defaultStructureTransformers,
			typeTransformers: DStoTS.defaultTypeTransformers,
			constraintTransformers: DStoTS.defaultConstraintTransformers,
		})).toMatchSnapshot();
	});
});
