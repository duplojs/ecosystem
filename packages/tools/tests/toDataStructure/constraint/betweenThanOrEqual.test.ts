import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoDS, DStoTS } from "@scripts";

describe("betweenThanOrEqualConstraintTransformer", () => {
	it("renders a customer birth year range", () => {
		const customerProfile = DDataStructure.object({
			birthYear: DDataStructure.number([DDataStructure.betweenThanOrEqual(1900, 2100)]),
		});

		expect(DStoDS.render(customerProfile, {
			identifier: "CustomerProfile",
			structureTransformers: DStoDS.defaultStructureTransformers,
			constraintTransformers: [DStoDS.betweenThanOrEqualConstraintTransformer],
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		})).toMatchSnapshot();
	});
});
