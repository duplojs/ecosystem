import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoDS, DStoTS } from "@scripts";

describe("betweenThanConstraintTransformer", () => {
	it("renders a private promotion rate", () => {
		const promotionRule = DDataStructure.object({
			discountPercent: DDataStructure.number([DDataStructure.betweenThan(0, 100)]),
		});

		expect(DStoDS.render(promotionRule, {
			identifier: "PromotionRule",
			structureTransformers: DStoDS.defaultStructureTransformers,
			constraintTransformers: [DStoDS.betweenThanConstraintTransformer],
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		})).toMatchSnapshot();
	});
});
