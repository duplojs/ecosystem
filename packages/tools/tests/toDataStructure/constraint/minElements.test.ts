import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoDS, DStoTS } from "@scripts";

describe("minElementsConstraintTransformer", () => {
	it("renders a required checkout line list", () => {
		const checkout = DDataStructure.object({
			lines: DDataStructure.array(DDataStructure.string(), [DDataStructure.minElements(1)]),
		});

		expect(DStoDS.render(checkout, {
			identifier: "Checkout",
			structureTransformers: DStoDS.defaultStructureTransformers,
			constraintTransformers: [DStoDS.minElementsConstraintTransformer],
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		})).toMatchSnapshot();
	});
});
