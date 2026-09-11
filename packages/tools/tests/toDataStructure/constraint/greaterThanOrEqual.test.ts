import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoDS, DStoTS } from "@scripts";

describe("greaterThanOrEqualConstraintTransformer", () => {
	it("renders a non negative stock level", () => {
		const stockLevel = DDataStructure.object({
			available: DDataStructure.number([DDataStructure.greaterThanOrEqual(0)]),
		});

		expect(DStoDS.render(stockLevel, {
			identifier: "StockLevel",
			structureTransformers: DStoDS.defaultStructureTransformers,
			constraintTransformers: [DStoDS.greaterThanOrEqualConstraintTransformer],
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		})).toMatchSnapshot();
	});
});
