import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoDS, DStoTS } from "@scripts";

describe("integerConstraintTransformer", () => {
	it("renders an integer product quantity", () => {
		const productQuantity = DDataStructure.object({
			quantity: DDataStructure.number([DDataStructure.integer()]),
		});

		expect(DStoDS.render(productQuantity, {
			identifier: "ProductQuantity",
			structureTransformers: DStoDS.defaultStructureTransformers,
			constraintTransformers: [DStoDS.integerConstraintTransformer],
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		})).toMatchSnapshot();
	});
});
