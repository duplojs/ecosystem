import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoDS, DStoTS } from "@scripts";

describe("multipleOfConstraintTransformer", () => {
	it("renders a price step in cents", () => {
		const priceRule = DDataStructure.object({
			priceCents: DDataStructure.number([DDataStructure.multipleOf(5)]),
		});

		expect(DStoDS.render(priceRule, {
			identifier: "PriceRule",
			structureTransformers: DStoDS.defaultStructureTransformers,
			constraintTransformers: [DStoDS.multipleOfConstraintTransformer],
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		})).toMatchSnapshot();
	});
});
