import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoDS, DStoTS } from "@scripts";

describe("positiveConstraintTransformer", () => {
	it("renders a positive subscription price", () => {
		const subscriptionPlan = DDataStructure.object({
			priceCents: DDataStructure.number([DDataStructure.positive()]),
		});

		expect(DStoDS.render(subscriptionPlan, {
			identifier: "SubscriptionPlan",
			structureTransformers: DStoDS.defaultStructureTransformers,
			constraintTransformers: [DStoDS.positiveConstraintTransformer],
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		})).toMatchSnapshot();
	});
});
