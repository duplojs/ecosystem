import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DModeling from "@duplojs/lang/modeling";
import { DStoJS } from "@scripts";

describe("objectStructureTransformer", () => {
	it("renders an object structure", () => {
		expect(DStoJS.render(
			DDataStructure.object({
				id: DDataStructure.string([DDataStructure.uuid()]),
				email: DDataStructure.string([DDataStructure.email()]),
				enabled: DDataStructure.boolean(),
			}),
			{
				identifier: "Value",
				structureTransformers: DStoJS.defaultStructureTransformers,
				typeTransformers: DStoJS.defaultTypeTransformers,
				version: "jsonSchema7",
			},
		)).toMatchSnapshot();
	});

	it("renders a complex API response object", () => {
		expect(DStoJS.render(
			DDataStructure.object({
				user: DDataStructure.object({
					id: DModeling.NewTypeStructure("UserId", DDataStructure.string([DDataStructure.uuid()]), []),
					role: DDataStructure.literal(["admin", "seller", "customer"]),
					profile: DDataStructure.union([
						DDataStructure.object({
							kind: DDataStructure.literal("company"),
							vatNumber: DDataStructure.string([DDataStructure.notEmpty()]),
						}),
						DDataStructure.object({
							kind: DDataStructure.literal("person"),
							birthYear: DDataStructure.number([
								DDataStructure.integer(),
								DDataStructure.betweenThanOrEqual(1900, 2100),
							]),
						}),
					]),
				}),
				orders: DDataStructure.array(DDataStructure.object({
					id: DDataStructure.string([DDataStructure.notEmpty()]),
					total: DDataStructure.number([DDataStructure.greaterThanOrEqual(0)]),
					status: DDataStructure.literal(["pending", "paid", "cancelled"]),
				}), [DDataStructure.maxElements(20)]),
				metadata: DDataStructure.record(
					DDataStructure.string(),
					DDataStructure.union([
						DDataStructure.string(),
						DDataStructure.number(),
						DDataStructure.boolean(),
					]),
				),
			}),
			{
				identifier: "Value",
				structureTransformers: DStoJS.defaultStructureTransformers,
				typeTransformers: DStoJS.defaultTypeTransformers,
				version: "jsonSchema7",
			},
		)).toMatchSnapshot();
	});

	it("renders a recursive object tree", () => {
		const structureStore: {
			category?: DDataStructure.Structure;
		} = {};

		const category = DDataStructure.object({
			id: DDataStructure.string([DDataStructure.uuid()]),
			name: DDataStructure.string([DDataStructure.notEmpty()]),
			children: DDataStructure.array(
				DDataStructure.lazy(() => structureStore.category!),
				[DDataStructure.maxElements(10)],
			),
		});

		structureStore.category = category;

		expect(DStoJS.render(
			category,
			{
				identifier: "Category",
				structureTransformers: DStoJS.defaultStructureTransformers,
				typeTransformers: DStoJS.defaultTypeTransformers,
				version: "jsonSchema7",
			},
		)).toMatchSnapshot();
	});

	it("throws when a property structure is not supported", () => {
		expect(() => DStoJS.render(
			DDataStructure.object({ value: DDataStructure.string() }),
			{
				identifier: "Value",
				structureTransformers: [DStoJS.objectStructureTransformer],
				typeTransformers: DStoJS.defaultTypeTransformers,
				version: "jsonSchema7",
			},
		)).toThrowErrorMatchingSnapshot();
	});
});
