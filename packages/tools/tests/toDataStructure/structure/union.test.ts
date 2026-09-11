import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoDS, DStoTS } from "@scripts";

describe("unionStructureTransformer", () => {
	it("renders checkout payment method variants", () => {
		const paymentMethod = DDataStructure.union([
			DDataStructure.object({
				kind: DDataStructure.literal("card"),
				last4: DDataStructure.string([DDataStructure.stringLengthEqual(4)]),
			}),
			DDataStructure.object({
				kind: DDataStructure.literal("bank-transfer"),
				iban: DDataStructure.string([DDataStructure.notEmpty()]),
			}),
			DDataStructure.null(),
		]).addIdentifier("PaymentMethod");

		expect(DStoDS.render(paymentMethod, {
			identifier: "RenderedPaymentMethod",
			structureTransformers: [
				DStoDS.objectStructureTransformer,
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

	it("propagates unsupported union value and constraints", () => {
		const unsupportedValue = () => DStoDS.render(DDataStructure.union([DDataStructure.string()]), {
			identifier: "UnionValue",
			structureTransformers: [DStoDS.unionStructureTransformer],
			constraintTransformers: DStoDS.defaultConstraintTransformers,
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		});
		const unsupportedConstraint = () => DStoDS.render(
			DDataStructure.union([DDataStructure.string()], [DDataStructure.minElements(1) as never]),
			{
				identifier: "UnionValue",
				structureTransformers: [DStoDS.typeStructureTransformer, DStoDS.unionStructureTransformer],
				constraintTransformers: [],
				toTypescript: {
					typeTransformers: DStoTS.defaultTypeTransformers,
					structureTransformers: DStoTS.defaultStructureTransformers,
					constraintTransformers: DStoTS.defaultConstraintTransformers,
				},
			},
		);

		expect([unsupportedValue, unsupportedConstraint].map((renderStructure) => {
			try {
				return renderStructure();
			} catch (error) {
				return error;
			}
		})).toMatchSnapshot();
	});
});
