import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoTS } from "@scripts";

describe("segmentPathConstraintTransformer", () => {
	it("renders an segmentPath constraint", () => {
		expect(DStoTS.render(DDataStructure.string([DDataStructure.segmentPath()]), {
			identifier: "SegmentPath",
			structureTransformers: DStoTS.defaultStructureTransformers,
			typeTransformers: DStoTS.defaultTypeTransformers,
			constraintTransformers: DStoTS.defaultConstraintTransformers,
		})).toMatchSnapshot();
	});
});
