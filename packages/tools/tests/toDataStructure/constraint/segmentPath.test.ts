import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoDS, DStoTS } from "@scripts";

describe("segmentPathConstraintTransformer", () => {
	it("renders a catalog slug segment", () => {
		const catalogCategory = DDataStructure.object({
			slug: DDataStructure.string([DDataStructure.segmentPath()]),
		});

		expect(DStoDS.render(catalogCategory, {
			identifier: "CatalogCategory",
			structureTransformers: DStoDS.defaultStructureTransformers,
			constraintTransformers: [DStoDS.segmentPathConstraintTransformer],
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		})).toMatchSnapshot();
	});
});
