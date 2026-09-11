import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoDS, DStoTS } from "@scripts";

describe("urlConstraintTransformer", () => {
	it("renders a product landing page URL", () => {
		const productLink = DDataStructure.object({
			url: DDataStructure.string([DDataStructure.url()]),
		});

		expect(DStoDS.render(productLink, {
			identifier: "ProductLink",
			structureTransformers: DStoDS.defaultStructureTransformers,
			constraintTransformers: [DStoDS.urlConstraintTransformer],
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		})).toMatchSnapshot();
	});
});
