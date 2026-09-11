import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoTS } from "@scripts";

describe("positiveConstraintTransformer", () => {
	it("renders a positive constraint", () => {
		expect(DStoTS.render(DDataStructure.number([DDataStructure.positive()]), {
			identifier: "Value",
			structureTransformers: DStoTS.defaultStructureTransformers,
			typeTransformers: DStoTS.defaultTypeTransformers,
			constraintTransformers: DStoTS.defaultConstraintTransformers,
		})).toMatchSnapshot();
	});
});
