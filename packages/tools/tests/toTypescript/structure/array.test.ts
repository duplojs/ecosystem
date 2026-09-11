import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DModeling from "@duplojs/lang/modeling";
import { DStoTS } from "@scripts";

describe("arrayStructureTransformer", () => {
	it("renders an array structure", () => {
		expect(DStoTS.render(DDataStructure.array(DDataStructure.string()), {
			identifier: "Value",
			structureTransformers: DStoTS.defaultStructureTransformers,
			typeTransformers: DStoTS.defaultTypeTransformers,
			constraintTransformers: DStoTS.defaultConstraintTransformers,
		})).toMatchSnapshot();
	});

	it("renders a product stock movement list", () => {
		const warehouseStock = DDataStructure.record(
			DDataStructure.literal(["main", "outlet"]),
			DDataStructure.number([
				DDataStructure.integer(),
				DDataStructure.greaterThanOrEqual(0),
			]),
		);

		expect(DStoTS.render(
			DDataStructure.array(DDataStructure.object({
				id: DModeling.NewTypeStructure("MovementId", DDataStructure.string(), []),
				sku: DDataStructure.string([DDataStructure.notEmpty()]),
				status: DDataStructure.union([
					DDataStructure.literal("pending"),
					DDataStructure.literal("applied"),
					DDataStructure.literal("cancelled"),
				]),
				warehouseStock,
			})),
			{
				identifier: "StockMovements",
				structureTransformers: DStoTS.defaultStructureTransformers,
				typeTransformers: DStoTS.defaultTypeTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		)).toMatchSnapshot();
	});

	it("propagates an unsupported element", () => {
		expect(() => DStoTS.render(DDataStructure.array(DDataStructure.string()), {
			identifier: "Value",
			structureTransformers: DStoTS.defaultStructureTransformers,
			typeTransformers: [],
			constraintTransformers: DStoTS.defaultConstraintTransformers,
		})).toThrowErrorMatchingSnapshot();
	});

	it("with identifier structure", () => {
		const structure = DDataStructure.array(DDataStructure.string())
			.addIdentifier("Test");

		expect(DStoTS.render(structure, {
			identifier: "Value",
			structureTransformers: DStoTS.defaultStructureTransformers,
			typeTransformers: DStoTS.defaultTypeTransformers,
			constraintTransformers: DStoTS.defaultConstraintTransformers,
		})).toMatchSnapshot();
	});
});
