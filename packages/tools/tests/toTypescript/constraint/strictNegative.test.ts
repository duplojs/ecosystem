import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoTS } from "@scripts";

describe("strictNegativeConstraintTransformer", () => {
	it("renders a strict-negative constraint", () => {
		expect(DStoTS.render(DDataStructure.number([DDataStructure.strictNegative()]), {
			identifier: "Value",
			structureTransformers: DStoTS.defaultStructureTransformers,
			typeTransformers: DStoTS.defaultTypeTransformers,
			constraintTransformers: DStoTS.defaultConstraintTransformers,
		})).toMatchSnapshot();
	});
});
