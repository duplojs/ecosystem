import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DModeling from "@duplojs/lang/modeling";
import * as DStoJS from "@scripts/toJsonSchema";

describe("toJsonSchema override", () => {
	it("renders named references for a product sheet database view", () => {
		const productIdentity = DDataStructure.object({
			sku: DDataStructure.string([DDataStructure.notEmpty()]),
			name: DDataStructure.string([DDataStructure.notEmpty()]),
			status: DDataStructure.literal(["draft", "published", "archived"]),
		}).addIdentifier("ProductIdentity");

		const price = DModeling.NewTypeStructure(
			"PriceAmount",
			DDataStructure.number([DDataStructure.greaterThanOrEqual(0)]),
			[],
		).addIdentifier("PriceAmount");

		const stockLine = DDataStructure.object({
			available: DDataStructure.number([
				DDataStructure.integer(),
				DDataStructure.greaterThanOrEqual(0),
			]),
			reserved: DDataStructure.number([
				DDataStructure.integer(),
				DDataStructure.greaterThanOrEqual(0),
			]),
		}).addIdentifier("StockLine");

		const characteristic = DDataStructure.object({
			code: DDataStructure.string([DDataStructure.notEmpty()]),
			value: DDataStructure.union([
				DDataStructure.string(),
				DDataStructure.number(),
				DDataStructure.boolean(),
			]),
		}).addIdentifier("ProductCharacteristic");

		expect(DStoJS.render(
			DDataStructure.object({
				product: productIdentity,
				price,
				stockByWarehouse: DDataStructure.record(
					DDataStructure.literal(["main", "outlet"]),
					stockLine,
				),
				characteristics: DDataStructure.array(characteristic, [DDataStructure.minElements(1)]),
				relatedProducts: DDataStructure.array(productIdentity),
			}),
			{
				identifier: "ProductSheet",
				structureTransformers: DStoJS.defaultStructureTransformers,
				typeTransformers: DStoJS.defaultTypeTransformers,
				version: "jsonSchema7",
			},
		)).toMatchSnapshot();
	});

	it("renders named references for a recursive catalog structure", () => {
		const structureStore: {
			category?: DDataStructure.Structure;
		} = {};

		const productSummary = DDataStructure.object({
			sku: DDataStructure.string([DDataStructure.notEmpty()]),
			name: DDataStructure.string([DDataStructure.notEmpty()]),
		}).addIdentifier("ProductSummary");

		const category = DDataStructure.object({
			id: DDataStructure.string([DDataStructure.uuid()]),
			name: DDataStructure.string([DDataStructure.notEmpty()]),
			children: DDataStructure.array(
				DDataStructure.lazy(() => structureStore.category!),
				[DDataStructure.maxElements(20)],
			),
			featuredProducts: DDataStructure.array(productSummary),
			parent: DDataStructure.union([
				DDataStructure.null(),
				DDataStructure.lazy(() => structureStore.category!),
			]),
		}).addIdentifier("CatalogCategory");

		structureStore.category = category;

		expect(DStoJS.render(
			category,
			{
				identifier: "CatalogCategory",
				structureTransformers: DStoJS.defaultStructureTransformers,
				typeTransformers: DStoJS.defaultTypeTransformers,
				version: "jsonSchema7",
			},
		)).toMatchSnapshot();
	});

	it("renders specific JSON schema overrides", () => {
		const sku = DDataStructure.string()
			.addIdentifier("Sku")
			.addOverrideJsonSchemaTransformer({
				type: "string",
				pattern: "^SKU-[0-9]{8}$",
			});

		const quantity = DDataStructure.number()
			.addIdentifier("Quantity")
			.addOverrideJsonSchemaTransformer(
				(_structure, { success }) => success({
					type: "integer",
					minimum: 0,
				}),
			);

		expect(DStoJS.render(
			DDataStructure.object({
				sku,
				quantity,
				stock: DDataStructure.record(
					DDataStructure.literal(["main", "secondary"]),
					quantity,
				),
			}),
			{
				identifier: "StockUpdate",
				structureTransformers: DStoJS.defaultStructureTransformers,
				typeTransformers: DStoJS.defaultTypeTransformers,
				version: "jsonSchema7",
			},
		)).toMatchSnapshot();
	});

	it("renders a named reference after removing a JSON schema override", () => {
		const removed = DDataStructure.string()
			.setOverrideJsonSchemaTransformer({
				type: "string",
				pattern: "^custom$",
			})
			.setOverrideJsonSchemaTransformer(null)
			.addIdentifier("StandardString");

		expect(DStoJS.render(
			DDataStructure.object({
				removed,
			}),
			{
				identifier: "OverrideLifecycle",
				structureTransformers: DStoJS.defaultStructureTransformers,
				typeTransformers: DStoJS.defaultTypeTransformers,
				version: "openApi31",
			},
		)).toMatchSnapshot();
	});
});
