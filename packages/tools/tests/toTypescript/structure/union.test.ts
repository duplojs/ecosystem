import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DModeling from "@duplojs/lang/modeling";
import { DStoTS } from "@scripts";

describe("unionStructureTransformer", () => {
	it("renders a union structure", () => {
		const structure = DDataStructure.union([
			DDataStructure.string(),
			DDataStructure.number(),
		]);

		expect(DStoTS.render(structure, {
			identifier: "Value",
			structureTransformers: DStoTS.defaultStructureTransformers,
			typeTransformers: DStoTS.defaultTypeTransformers,
			constraintTransformers: DStoTS.defaultConstraintTransformers,
		})).toMatchSnapshot();
	});

	it("renders a business event union", () => {
		expect(DStoTS.render(
			DDataStructure.union([
				DDataStructure.object({
					type: DDataStructure.literal("stock.updated"),
					payload: DDataStructure.object({
						sku: DDataStructure.string([DDataStructure.notEmpty()]),
						quantity: DDataStructure.number([
							DDataStructure.integer(),
							DDataStructure.greaterThanOrEqual(0),
						]),
					}),
				}),
				DDataStructure.object({
					type: DDataStructure.literal("customer.created"),
					payload: DModeling.NewTypeStructure("Customer", DDataStructure.object({
						id: DDataStructure.string([DDataStructure.uuid()]),
						email: DDataStructure.string([DDataStructure.email()]),
					}), []),
				}),
				DDataStructure.object({
					type: DDataStructure.literal("audit.logged"),
					payload: DDataStructure.record(
						DDataStructure.string(),
						DDataStructure.union([
							DDataStructure.string(),
							DDataStructure.number(),
							DDataStructure.boolean(),
							DDataStructure.null(),
						]),
					),
				}),
			]),
			{
				identifier: "DomainEvent",
				structureTransformers: DStoTS.defaultStructureTransformers,
				typeTransformers: DStoTS.defaultTypeTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		)).toMatchSnapshot();
	});

	it("propagates an unsupported member", () => {
		expect(() => DStoTS.render(
			DDataStructure.union([DDataStructure.string(), DDataStructure.number()]),
			{
				identifier: "Value",
				structureTransformers: DStoTS.defaultStructureTransformers,
				typeTransformers: [],
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		)).toThrowErrorMatchingSnapshot();
	});

	it("with identifier structure", () => {
		const structure = DDataStructure.union([
			DDataStructure.string(),
			DDataStructure.number(),
		]).addIdentifier("Test");

		expect(DStoTS.render(structure, {
			identifier: "Value",
			structureTransformers: DStoTS.defaultStructureTransformers,
			typeTransformers: DStoTS.defaultTypeTransformers,
			constraintTransformers: DStoTS.defaultConstraintTransformers,
		})).toMatchSnapshot();
	});
});
