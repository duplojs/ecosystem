import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoJS } from "@scripts";

describe("recordStructureTransformer", () => {
	it("renders record structures with required key inference", () => {
		const params = {
			identifier: "Value",
			structureTransformers: DStoJS.defaultStructureTransformers,
			typeTransformers: DStoJS.defaultTypeTransformers,
			version: "jsonSchema7" as const,
		};

		expect([
			DStoJS.render(
				DDataStructure.record(DDataStructure.string(), DDataStructure.number()),
				params,
			),
			DStoJS.render(
				DDataStructure.record(DDataStructure.literal("stock"), DDataStructure.number([
					DDataStructure.integer(),
					DDataStructure.greaterThanOrEqual(0),
				])),
				params,
			),
			DStoJS.render(
				DDataStructure.record(DDataStructure.literal(["draft", "published"]), DDataStructure.boolean()),
				params,
			),
		]).toMatchSnapshot();
	});

	it("renders a nested inventory record", () => {
		expect(DStoJS.render(
			DDataStructure.record(
				DDataStructure.literal(["warehouse-a", "warehouse-b"]),
				DDataStructure.object({
					stock: DDataStructure.number([
						DDataStructure.integer(),
						DDataStructure.greaterThanOrEqual(0),
					]),
					reservations: DDataStructure.array(DDataStructure.object({
						orderId: DDataStructure.string([DDataStructure.notEmpty()]),
						quantity: DDataStructure.number([
							DDataStructure.integer(),
							DDataStructure.strictPositive(),
						]),
					})),
					flags: DDataStructure.record(
						DDataStructure.string(),
						DDataStructure.union([
							DDataStructure.boolean(),
							DDataStructure.null(),
						]),
					),
				}),
			),
			{
				identifier: "InventoryByWarehouse",
				structureTransformers: DStoJS.defaultStructureTransformers,
				typeTransformers: DStoJS.defaultTypeTransformers,
				version: "jsonSchema7",
			},
		)).toMatchSnapshot();
	});

	it("throws when the key structure is not supported", () => {
		expect(() => DStoJS.render(
			DDataStructure.record(DDataStructure.string(), DDataStructure.number()),
			{
				identifier: "Value",
				structureTransformers: [DStoJS.recordStructureTransformer],
				typeTransformers: DStoJS.defaultTypeTransformers,
				version: "jsonSchema7",
			},
		)).toThrowErrorMatchingSnapshot();
	});

	it("throws when the value structure is not supported", () => {
		expect(() => DStoJS.render(
			DDataStructure.record(DDataStructure.string(), DDataStructure.number()),
			{
				identifier: "Value",
				structureTransformers: [DStoJS.recordStructureTransformer, DStoJS.typeStructureTransformer],
				typeTransformers: [DStoJS.stringTypeTransformer],
				version: "jsonSchema7",
			},
		)).toThrowErrorMatchingSnapshot();
	});
});
