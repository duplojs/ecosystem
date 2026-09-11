import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DModeling from "@duplojs/lang/modeling";
import { DStoJS } from "@scripts";

describe("unionStructureTransformer", () => {
	it("renders a union structure", () => {
		expect(DStoJS.render(
			DDataStructure.union([
				DDataStructure.string(),
				DDataStructure.number([DDataStructure.integer()]),
				DDataStructure.null(),
			]),
			{
				identifier: "Value",
				structureTransformers: DStoJS.defaultStructureTransformers,
				typeTransformers: DStoJS.defaultTypeTransformers,
				version: "jsonSchema7",
			},
		)).toMatchSnapshot();
	});

	it("renders a complex event union", () => {
		expect(DStoJS.render(
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
						segments: DDataStructure.array(DDataStructure.literal(["retail", "pro"])),
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
				identifier: "Event",
				structureTransformers: DStoJS.defaultStructureTransformers,
				typeTransformers: DStoJS.defaultTypeTransformers,
				version: "jsonSchema7",
			},
		)).toMatchSnapshot();
	});

	it("throws when a union value is not supported", () => {
		expect(() => DStoJS.render(
			DDataStructure.union([
				DDataStructure.string(),
				DDataStructure.number(),
			]),
			{
				identifier: "Value",
				structureTransformers: [DStoJS.unionStructureTransformer],
				typeTransformers: DStoJS.defaultTypeTransformers,
				version: "jsonSchema7",
			},
		)).toThrowErrorMatchingSnapshot();
	});
});
