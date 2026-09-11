import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoDS, DStoTS } from "@scripts";

describe("notEmptyConstraintTransformer", () => {
	it("renders a required stock keeping unit", () => {
		const productReference = DDataStructure.object({
			sku: DDataStructure.string([DDataStructure.notEmpty()]),
		});

		expect(DStoDS.render(productReference, {
			identifier: "ProductReference",
			structureTransformers: DStoDS.defaultStructureTransformers,
			constraintTransformers: [DStoDS.notEmptyConstraintTransformer],
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		})).toMatchSnapshot();
	});
});
