import * as DSDataStructure from "@duplojs/server/dataStructure";
import { DStoTS } from "@scripts";

describe("fileTypeTransformer", () => {
	it("renders a file type and its import", () => {
		expect(DStoTS.render(
			DSDataStructure.file(),
			{
				identifier: "Value",
				structureTransformers: DStoTS.defaultStructureTransformers,
				typeTransformers: DStoTS.defaultTypeTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		)).toMatchSnapshot();
	});
});
