import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DModeling from "@duplojs/lang/modeling";
import { DStoDS, DStoTS } from "@scripts";

describe("objectStructureTransformer", () => {
	it("renders a product sheet with nested business fields", () => {
		const price = DModeling.NewTypeStructure(
			"PriceAmount",
			DDataStructure.number([DDataStructure.greaterThanOrEqual(0)]),
			[],
		).addIdentifier("PriceAmountStructure");
		const productSheet = DDataStructure.object({
			sku: DDataStructure.string([DDataStructure.notEmpty()]),
			name: DDataStructure.string([DDataStructure.minCharacters(3), DDataStructure.maxCharacters(120)]),
			price,
			tags: DDataStructure.array(DDataStructure.string([DDataStructure.trimmed()])),
			status: DDataStructure.literal(["draft", "published", "archived"]),
			stockByWarehouse: DDataStructure.record(
				DDataStructure.literal(["main", "outlet"]),
				DDataStructure.number([DDataStructure.integer(), DDataStructure.greaterThanOrEqual(0)]),
			),
		});

		expect(DStoDS.render(productSheet, {
			identifier: "ProductSheet",
			typeTransformers: DStoDS.defaultTypeTransformers,
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

	it("propagates unsupported object property and constraints", () => {
		const unsupportedProperty = () => DStoDS.render(DDataStructure.object({ id: DDataStructure.string() }), {
			identifier: "ObjectValue",
			typeTransformers: DStoDS.defaultTypeTransformers,
			structureTransformers: [DStoDS.objectStructureTransformer],
			constraintTransformers: DStoDS.defaultConstraintTransformers,
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		});
		const unsupportedConstraint = () => DStoDS.render(
			DDataStructure.object({ id: DDataStructure.string() }, [DDataStructure.minElements(1) as never]),
			{
				identifier: "ObjectValue",
				typeTransformers: DStoDS.defaultTypeTransformers,
				structureTransformers: [DStoDS.objectStructureTransformer, DStoDS.typeStructureTransformer],
				constraintTransformers: [],
				toTypescript: {
					typeTransformers: DStoTS.defaultTypeTransformers,
					structureTransformers: DStoTS.defaultStructureTransformers,
					constraintTransformers: DStoTS.defaultConstraintTransformers,
				},
			},
		);

		expect([unsupportedProperty, unsupportedConstraint].map((renderStructure) => {
			try {
				return renderStructure();
			} catch (error) {
				return error;
			}
		})).toMatchSnapshot();
	});
});
