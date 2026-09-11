import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoTS } from "@scripts";

describe("absolutePathConstraintTransformer", () => {
	it("renders an absolutePath constraint", () => {
		expect(DStoTS.render(DDataStructure.string([DDataStructure.absolutePath()]), {
			identifier: "AbsolutePath",
			structureTransformers: DStoTS.defaultStructureTransformers,
			typeTransformers: DStoTS.defaultTypeTransformers,
			constraintTransformers: DStoTS.defaultConstraintTransformers,
		})).toMatchSnapshot();
	});
});
