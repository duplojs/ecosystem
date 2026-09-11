import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DModeling from "@duplojs/lang/modeling";
import { DStoJS } from "@scripts";

describe("taggedObjectStructureTransformer", () => {
	it("renders an taggedObject structure", () => {
		expect(DStoJS.render(
			DModeling.createTaggedObject(
				"user-simple",
				{
					id: DDataStructure.string([DDataStructure.uuid()]),
					email: DDataStructure.string([DDataStructure.email()]),
				},
			),
			{
				identifier: "Value",
				structureTransformers: DStoJS.defaultStructureTransformers,
				typeTransformers: DStoJS.defaultTypeTransformers,
				version: "jsonSchema7",
			},
		)).toMatchSnapshot();
	});

	it("renders a complex tagged audit event", () => {
		expect(DStoJS.render(
			DModeling.createTaggedObject(
				"audit-event",
				{
					id: DDataStructure.string([DDataStructure.uuid()]),
					actorId: DModeling.NewTypeStructure("UserId", DDataStructure.string([DDataStructure.uuid()]), []),
					payload: DDataStructure.union([
						DDataStructure.object({
							type: DDataStructure.literal("product.updated"),
							changes: DDataStructure.record(
								DDataStructure.string(),
								DDataStructure.string([DDataStructure.notEmpty()]),
							),
						}),
						DDataStructure.object({
							type: DDataStructure.literal("stock.adjusted"),
							quantity: DDataStructure.number([DDataStructure.integer()]),
							reason: DDataStructure.literal(["correction", "sale", "return"]),
						}),
					]),
					metadata: DDataStructure.record(
						DDataStructure.string(),
						DDataStructure.union([
							DDataStructure.string(),
							DDataStructure.number(),
							DDataStructure.boolean(),
						]),
					),
				},
			),
			{
				identifier: "Value",
				structureTransformers: DStoJS.defaultStructureTransformers,
				typeTransformers: DStoJS.defaultTypeTransformers,
				version: "jsonSchema7",
			},
		)).toMatchSnapshot();
	});

	it("renders a recursive tagged object tree", () => {
		const structureStore: {
			category?: DDataStructure.Structure;
		} = {};

		const category = DModeling.createTaggedObject(
			"category-node",
			{
				id: DDataStructure.string([DDataStructure.uuid()]),
				name: DDataStructure.string([DDataStructure.notEmpty()]),
				children: DDataStructure.array(
					DDataStructure.lazy(() => structureStore.category!),
					[DDataStructure.maxElements(10)],
				),
			},
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
			DModeling.createTaggedObject(
				"user-simple",
				{
					id: DDataStructure.string(),
				},
			),
			{
				identifier: "Value",
				structureTransformers: [DStoJS.taggedObjectStructureTransformer],
				typeTransformers: DStoJS.defaultTypeTransformers,
				version: "jsonSchema7",
			},
		)).toThrowErrorMatchingSnapshot();
	});
});
