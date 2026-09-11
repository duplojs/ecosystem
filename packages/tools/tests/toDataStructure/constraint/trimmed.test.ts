import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoDS, DStoTS } from "@scripts";

describe("trimmedConstraintTransformer", () => {
	it("renders a trimmed customer display name", () => {
		const customerDisplay = DDataStructure.object({
			displayName: DDataStructure.string([DDataStructure.trimmed()]),
		});

		expect(DStoDS.render(customerDisplay, {
			identifier: "CustomerDisplay",
			structureTransformers: DStoDS.defaultStructureTransformers,
			constraintTransformers: [DStoDS.trimmedConstraintTransformer],
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		})).toMatchSnapshot();
	});
});
