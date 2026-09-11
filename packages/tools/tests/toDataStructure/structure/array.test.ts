import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DModeling from "@duplojs/lang/modeling";
import { DStoDS, DStoTS } from "@scripts";

describe("arrayStructureTransformer", () => {
	it("renders stock movements with nested structures", () => {
		const warehouseStock = DDataStructure.record(
			DDataStructure.literal(["main", "outlet"]),
			DDataStructure.number([
				DDataStructure.integer(),
				DDataStructure.greaterThanOrEqual(0),
			]),
		);
		const stockMovement = DDataStructure.object({
			id: DModeling.NewTypeStructure("MovementId", DDataStructure.string([DDataStructure.uuid()]), []),
			sku: DDataStructure.string([DDataStructure.notEmpty()]),
			status: DDataStructure.union([
				DDataStructure.literal("pending"),
				DDataStructure.literal("applied"),
				DDataStructure.literal("cancelled"),
			]),
			warehouseStock,
		});
		const stockMovements = DDataStructure.array(
			stockMovement,
			[DDataStructure.minElements(1), DDataStructure.maxElements(200)],
		);

		expect(DStoDS.render(stockMovements, {
			identifier: "StockMovements",
			structureTransformers: [
				DStoDS.arrayStructureTransformer,
				DStoDS.newTypeStructureTransformer,
				DStoDS.objectStructureTransformer,
				DStoDS.recordStructureTransformer,
				DStoDS.typeStructureTransformer,
				DStoDS.unionStructureTransformer,
			],
			constraintTransformers: DStoDS.defaultConstraintTransformers,
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		})).toMatchSnapshot();
	});

	it("propagates unsupported element and constraints", () => {
		const unsupportedElement = () => DStoDS.render(DDataStructure.array(DDataStructure.string()), {
			identifier: "ArrayValue",
			structureTransformers: [DStoDS.arrayStructureTransformer],
			constraintTransformers: DStoDS.defaultConstraintTransformers,
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		});
		const unsupportedConstraint = () => DStoDS.render(
			DDataStructure.array(DDataStructure.string(), [DDataStructure.minElements(1)]),
			{
				identifier: "ArrayValue",
				structureTransformers: [DStoDS.arrayStructureTransformer, DStoDS.typeStructureTransformer],
				constraintTransformers: [],
				toTypescript: {
					typeTransformers: DStoTS.defaultTypeTransformers,
					structureTransformers: DStoTS.defaultStructureTransformers,
					constraintTransformers: DStoTS.defaultConstraintTransformers,
				},
			},
		);

		expect([unsupportedElement, unsupportedConstraint].map((renderStructure) => {
			try {
				return renderStructure();
			} catch (error) {
				return error;
			}
		})).toMatchSnapshot();
	});
});
