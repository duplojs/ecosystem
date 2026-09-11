import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoDS, DStoTS } from "@scripts";

describe("lessThanConstraintTransformer", () => {
	it("renders a fraud score upper bound", () => {
		const fraudSignal = DDataStructure.object({
			score: DDataStructure.number([DDataStructure.lessThan(1)]),
		});

		expect(DStoDS.render(fraudSignal, {
			identifier: "FraudSignal",
			structureTransformers: DStoDS.defaultStructureTransformers,
			constraintTransformers: [DStoDS.lessThanConstraintTransformer],
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		})).toMatchSnapshot();
	});
});
