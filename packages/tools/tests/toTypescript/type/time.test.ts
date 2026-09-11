import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoTS } from "@scripts";

describe("timeTypeTransformer", () => {
	it("renders a time type and its import", () => {
		expect(DStoTS.render(
			DDataStructure.time(),
			{
				identifier: "Value",
				structureTransformers: DStoTS.defaultStructureTransformers,
				typeTransformers: DStoTS.defaultTypeTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		)).toMatchSnapshot();
	});
});
