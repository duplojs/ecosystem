import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoTS } from "@scripts";

describe("pathConstraintTransformer", () => {
	it("renders an path constraint", () => {
		expect(DStoTS.render(DDataStructure.string([DDataStructure.path()]), {
			identifier: "Path",
			structureTransformers: DStoTS.defaultStructureTransformers,
			typeTransformers: DStoTS.defaultTypeTransformers,
			constraintTransformers: DStoTS.defaultConstraintTransformers,
		})).toMatchSnapshot();
	});
});
