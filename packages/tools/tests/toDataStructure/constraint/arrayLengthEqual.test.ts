import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoDS, DStoTS } from "@scripts";

describe("arrayLengthEqualConstraintTransformer", () => {
	it("renders a two person approval chain", () => {
		const purchaseApproval = DDataStructure.object({
			approvers: DDataStructure.array(
				DDataStructure.string(),
				[DDataStructure.arrayLengthEqual(2)],
			),
		});

		expect(DStoDS.render(purchaseApproval, {
			identifier: "PurchaseApproval",
			structureTransformers: DStoDS.defaultStructureTransformers,
			constraintTransformers: [DStoDS.arrayLengthEqualConstraintTransformer],
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		})).toMatchSnapshot();
	});
});
