import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoDS, DStoTS } from "@scripts";

describe("safeConstraintTransformer", () => {
	it("renders a safe accounting amount", () => {
		const accountingEntry = DDataStructure.object({
			amountCents: DDataStructure.number([DDataStructure.safe()]),
		});

		expect(DStoDS.render(accountingEntry, {
			identifier: "AccountingEntry",
			structureTransformers: DStoDS.defaultStructureTransformers,
			constraintTransformers: [DStoDS.safeConstraintTransformer],
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		})).toMatchSnapshot();
	});
});
