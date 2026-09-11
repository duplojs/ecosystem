import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoTS } from "@scripts";

describe("numberTypeTransformer", () => {
	it("renders a number type", () => {
		expect(DStoTS.render(
			DDataStructure.number(),
			{
				identifier: "Value",
				structureTransformers: DStoTS.defaultStructureTransformers,
				typeTransformers: DStoTS.defaultTypeTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		)).toMatchSnapshot();
	});
});
