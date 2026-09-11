import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoTS } from "@scripts";

describe("strictPositiveConstraintTransformer", () => {
	it("renders a strict-positive constraint", () => {
		expect(DStoTS.render(DDataStructure.number([DDataStructure.strictPositive()]), {
			identifier: "Value",
			structureTransformers: DStoTS.defaultStructureTransformers,
			typeTransformers: DStoTS.defaultTypeTransformers,
			constraintTransformers: DStoTS.defaultConstraintTransformers,
		})).toMatchSnapshot();
	});
});
