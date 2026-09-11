import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoDS, DStoTS } from "@scripts";

describe("maxCharactersConstraintTransformer", () => {
	it("renders a short product title limit", () => {
		const productSummary = DDataStructure.object({
			title: DDataStructure.string([DDataStructure.maxCharacters(80)]),
		});

		expect(DStoDS.render(productSummary, {
			identifier: "ProductSummary",
			structureTransformers: DStoDS.defaultStructureTransformers,
			constraintTransformers: [DStoDS.maxCharactersConstraintTransformer],
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		})).toMatchSnapshot();
	});
});
