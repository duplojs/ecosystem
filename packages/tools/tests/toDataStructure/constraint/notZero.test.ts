import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoDS, DStoTS } from "@scripts";

describe("notZeroConstraintTransformer", () => {
	it("renders a non zero manual adjustment", () => {
		const inventoryAdjustment = DDataStructure.object({
			delta: DDataStructure.number([DDataStructure.notZero()]),
		});

		expect(DStoDS.render(inventoryAdjustment, {
			identifier: "InventoryAdjustment",
			structureTransformers: DStoDS.defaultStructureTransformers,
			constraintTransformers: [DStoDS.notZeroConstraintTransformer],
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		})).toMatchSnapshot();
	});
});
