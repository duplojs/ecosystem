import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DModeling from "@duplojs/lang/modeling";
import { DStoJS } from "@scripts";

describe("entityStructureTransformer", () => {
	it("renders an entity structure", () => {
		expect(DStoJS.render(
			DModeling.createEntity(
				"User",
				() => ({
					id: DModeling.createNewType(
						"UserId",
						DDataStructure.string(),
						[DDataStructure.uuid()],
					),
					email: DModeling.createNewType(
						"UserEmail",
						DDataStructure.string(),
						[DDataStructure.email()],
					),
				}),
			),
			{
				identifier: "Value",
				structureTransformers: DStoJS.defaultStructureTransformers,
				typeTransformers: DStoJS.defaultTypeTransformers,
				version: "jsonSchema7",
			},
		)).toMatchSnapshot();
	});

	it("renders a complex product entity", () => {
		expect(DStoJS.render(
			DModeling.EntityStructure(
				"Product",
				() => ({
					id: DModeling.NewTypeStructure("ProductId", DDataStructure.string([DDataStructure.uuid()]), []),
					sku: DDataStructure.string([DDataStructure.notEmpty()]),
					status: DDataStructure.literal(["draft", "published", "archived"]),
					prices: DDataStructure.record(
						DDataStructure.literal(["EUR", "USD"]),
						DDataStructure.number([DDataStructure.greaterThanOrEqual(0)]),
					),
					variants: DDataStructure.array(DDataStructure.object({
						reference: DDataStructure.string([DDataStructure.notEmpty()]),
						stock: DDataStructure.number([DDataStructure.integer()]),
					}), [DDataStructure.maxElements(25)]),
					metadata: DDataStructure.record(
						DDataStructure.string(),
						DDataStructure.union([
							DDataStructure.string(),
							DDataStructure.number(),
							DDataStructure.boolean(),
						]),
					),
				}),
			),
			{
				identifier: "Value",
				structureTransformers: DStoJS.defaultStructureTransformers,
				typeTransformers: DStoJS.defaultTypeTransformers,
				version: "jsonSchema7",
			},
		)).toMatchSnapshot();
	});

	it("renders a recursive entity tree", () => {
		const structureStore: {
			category?: DDataStructure.Structure;
		} = {};

		const category = DModeling.EntityStructure(
			"Category",
			() => ({
				id: DModeling.NewTypeStructure(
					"CategoryId",
					DDataStructure.string([DDataStructure.uuid()]),
					[],
				),
				name: DDataStructure.string([DDataStructure.notEmpty()]),
				children: DDataStructure.array(
					DDataStructure.lazy(() => structureStore.category!),
					[DDataStructure.maxElements(10)],
				),
			}),
		);

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

	it("throws when the inner object is not supported", () => {
		expect(() => DStoJS.render(
			DModeling.EntityStructure(
				"User",
				() => ({
					id: DDataStructure.string(),
				}),
			),
			{
				identifier: "Value",
				structureTransformers: [DStoJS.entityStructureTransformer],
				typeTransformers: DStoJS.defaultTypeTransformers,
				version: "jsonSchema7",
			},
		)).toThrowErrorMatchingSnapshot();
	});
});
