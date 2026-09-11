import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DModeling from "@duplojs/lang/modeling";
import { DStoDS, DStoTS } from "@scripts";

describe("newTypeStructureTransformer", () => {
	it("renders a money new type with inner and new type constraints", () => {
		const money = DModeling.NewTypeStructure(
			"MoneyAmount",
			DDataStructure.number([
				DDataStructure.integer(),
				DDataStructure.greaterThanOrEqual(0),
			]),
			[DDataStructure.safe()],
		).addIdentifier("MoneyAmountStructure");

		expect(DStoDS.render(money, {
			identifier: "RenderedMoney",
			structureTransformers: [
				DStoDS.newTypeStructureTransformer,
				DStoDS.typeStructureTransformer,
			],
			constraintTransformers: DStoDS.defaultConstraintTransformers,
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		})).toMatchSnapshot();
	});

	it("propagates unsupported inner structure and new type constraints", () => {
		const unsupportedInner = () => DStoDS.render(DModeling.NewTypeStructure("Sku", DDataStructure.string(), []), {
			identifier: "SkuValue",
			structureTransformers: [DStoDS.newTypeStructureTransformer],
			constraintTransformers: DStoDS.defaultConstraintTransformers,
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		});
		const unsupportedConstraint = () => DStoDS.render(
			DModeling.NewTypeStructure("Quantity", DDataStructure.number(), [DDataStructure.integer()]),
			{
				identifier: "QuantityValue",
				structureTransformers: [DStoDS.newTypeStructureTransformer, DStoDS.typeStructureTransformer],
				constraintTransformers: [],
				toTypescript: {
					typeTransformers: DStoTS.defaultTypeTransformers,
					structureTransformers: DStoTS.defaultStructureTransformers,
					constraintTransformers: DStoTS.defaultConstraintTransformers,
				},
			},
		);

		expect([unsupportedInner, unsupportedConstraint].map((renderStructure) => {
			try {
				return renderStructure();
			} catch (error) {
				return error;
			}
		})).toMatchSnapshot();
	});
});
