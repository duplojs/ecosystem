import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoDS, DStoTS } from "@scripts";

describe("recordStructureTransformer", () => {
	it("renders inventory by warehouse records", () => {
		const inventoryByWarehouse = DDataStructure.record(
			DDataStructure.literal(["main", "outlet", "supplier"]),
			DDataStructure.object({
				available: DDataStructure.number([DDataStructure.integer(), DDataStructure.greaterThanOrEqual(0)]),
				reserved: DDataStructure.number([DDataStructure.integer(), DDataStructure.greaterThanOrEqual(0)]),
				nextRestock: DDataStructure.union([
					DDataStructure.string([DDataStructure.trimmed()]),
					DDataStructure.null(),
				]),
			}),
		).addIdentifier("InventoryByWarehouse");

		expect(DStoDS.render(inventoryByWarehouse, {
			identifier: "RenderedInventory",
			structureTransformers: [
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

	it("propagates unsupported record key, value and constraints", () => {
		const unsupportedKey = () => DStoDS.render(
			DDataStructure.record(DDataStructure.string(), DDataStructure.number()),
			{
				identifier: "RecordKeyValue",
				structureTransformers: [DStoDS.recordStructureTransformer],
				constraintTransformers: DStoDS.defaultConstraintTransformers,
				toTypescript: {
					typeTransformers: DStoTS.defaultTypeTransformers,
					structureTransformers: DStoTS.defaultStructureTransformers,
					constraintTransformers: DStoTS.defaultConstraintTransformers,
				},
			},
		);
		const unsupportedValue = () => DStoDS.render(DDataStructure.record(
			DDataStructure.string(),
			DDataStructure.object({ id: DDataStructure.string() }),
		), {
			identifier: "RecordInnerValue",
			structureTransformers: [DStoDS.recordStructureTransformer, DStoDS.typeStructureTransformer],
			constraintTransformers: DStoDS.defaultConstraintTransformers,
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		});
		const unsupportedConstraint = () => DStoDS.render(DDataStructure.record(
			DDataStructure.string(),
			DDataStructure.number(),
			[DDataStructure.minElements(1) as never],
		), {
			identifier: "RecordValue",
			structureTransformers: [DStoDS.recordStructureTransformer, DStoDS.typeStructureTransformer],
			constraintTransformers: [],
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		});

		expect([unsupportedKey, unsupportedValue, unsupportedConstraint].map((renderStructure) => {
			try {
				return renderStructure();
			} catch (error) {
				return error;
			}
		})).toMatchSnapshot();
	});
});
