import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoDS, DStoTS } from "@scripts";

describe("strictPositiveConstraintTransformer", () => {
	it("renders a strict positive invoice total", () => {
		const invoiceTotal = DDataStructure.object({
			amount: DDataStructure.number([DDataStructure.strictPositive()]),
		});

		expect(DStoDS.render(invoiceTotal, {
			identifier: "InvoiceTotal",
			structureTransformers: DStoDS.defaultStructureTransformers,
			constraintTransformers: [DStoDS.strictPositiveConstraintTransformer],
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		})).toMatchSnapshot();
	});
});
