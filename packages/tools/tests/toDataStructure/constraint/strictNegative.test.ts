import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoDS, DStoTS } from "@scripts";

describe("strictNegativeConstraintTransformer", () => {
	it("renders a strict debit movement", () => {
		const debitMovement = DDataStructure.object({
			amount: DDataStructure.number([DDataStructure.strictNegative()]),
		});

		expect(DStoDS.render(debitMovement, {
			identifier: "DebitMovement",
			structureTransformers: DStoDS.defaultStructureTransformers,
			constraintTransformers: [DStoDS.strictNegativeConstraintTransformer],
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		})).toMatchSnapshot();
	});
});
