import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoDS, DStoTS } from "@scripts";

describe("pathConstraintTransformer", () => {
	it("renders an invoice file path", () => {
		const invoiceDocument = DDataStructure.object({
			path: DDataStructure.string([DDataStructure.path()]),
		});

		expect(DStoDS.render(invoiceDocument, {
			identifier: "InvoiceDocument",
			structureTransformers: DStoDS.defaultStructureTransformers,
			constraintTransformers: [DStoDS.pathConstraintTransformer],
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		})).toMatchSnapshot();
	});
});
