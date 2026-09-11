import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoDS, DStoTS } from "@scripts";

describe("evenConstraintTransformer", () => {
	it("renders an even warehouse aisle number", () => {
		const warehouseAisle = DDataStructure.object({
			aisle: DDataStructure.number([DDataStructure.even()]),
		});

		expect(DStoDS.render(warehouseAisle, {
			identifier: "WarehouseAisle",
			structureTransformers: DStoDS.defaultStructureTransformers,
			constraintTransformers: [DStoDS.evenConstraintTransformer],
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		})).toMatchSnapshot();
	});
});
