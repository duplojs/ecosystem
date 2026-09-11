import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoDS, DStoTS } from "@scripts";

describe("nonEncodableStringStructureTransformer", () => {
	it("renders an opaque generated document marker", () => {
		const generatedInvoicePdf = DDataStructure.NonEncodableStringStructure("generated-invoice-pdf")
			.addIdentifier("GeneratedInvoicePdf");

		expect(DStoDS.render(generatedInvoicePdf, {
			identifier: "RenderedInvoicePdf",
			structureTransformers: [DStoDS.nonEncodableStringStructureTransformer],
			constraintTransformers: DStoDS.defaultConstraintTransformers,
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		})).toMatchSnapshot();
	});
});
