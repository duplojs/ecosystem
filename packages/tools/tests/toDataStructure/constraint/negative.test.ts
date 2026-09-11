import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoDS, DStoTS } from "@scripts";

describe("negativeConstraintTransformer", () => {
	it("renders a balance correction debit", () => {
		const balanceAdjustment = DDataStructure.object({
			amount: DDataStructure.number([DDataStructure.negative()]),
		});

		expect(DStoDS.render(balanceAdjustment, {
			identifier: "BalanceAdjustment",
			structureTransformers: DStoDS.defaultStructureTransformers,
			constraintTransformers: [DStoDS.negativeConstraintTransformer],
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		})).toMatchSnapshot();
	});
});
