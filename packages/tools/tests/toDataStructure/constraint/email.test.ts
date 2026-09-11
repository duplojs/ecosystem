import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoDS, DStoTS } from "@scripts";

describe("emailConstraintTransformer", () => {
	it("renders a support contact email", () => {
		const supportContact = DDataStructure.object({
			email: DDataStructure.string([DDataStructure.email()]),
		});

		expect(DStoDS.render(supportContact, {
			identifier: "SupportContact",
			structureTransformers: DStoDS.defaultStructureTransformers,
			constraintTransformers: [DStoDS.emailConstraintTransformer],
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		})).toMatchSnapshot();
	});
});
