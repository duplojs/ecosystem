import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoTS } from "@scripts";

describe("stringTypeTransformer", () => {
	it("renders a string type", () => {
		expect(DStoTS.render(
			DDataStructure.string(),
			{
				identifier: "Value",
				structureTransformers: DStoTS.defaultStructureTransformers,
				typeTransformers: DStoTS.defaultTypeTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		)).toMatchSnapshot();
	});
});
