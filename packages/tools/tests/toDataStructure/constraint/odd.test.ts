import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoDS, DStoTS } from "@scripts";

describe("oddConstraintTransformer", () => {
	it("renders an odd picking zone number", () => {
		const pickingZone = DDataStructure.object({
			zone: DDataStructure.number([DDataStructure.odd()]),
		});

		expect(DStoDS.render(pickingZone, {
			identifier: "PickingZone",
			structureTransformers: DStoDS.defaultStructureTransformers,
			constraintTransformers: [DStoDS.oddConstraintTransformer],
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		})).toMatchSnapshot();
	});
});
