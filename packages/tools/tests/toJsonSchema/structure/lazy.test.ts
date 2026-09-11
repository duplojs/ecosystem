import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoJS } from "@scripts";

describe("lazyStructureTransformer", () => {
	it("renders a lazy structure", () => {
		expect(DStoJS.render(
			DDataStructure.lazy(() => DDataStructure.object({
				id: DDataStructure.string([DDataStructure.uuid()]),
				name: DDataStructure.string([DDataStructure.notEmpty()]),
			})),
			{
				identifier: "Value",
				structureTransformers: DStoJS.defaultStructureTransformers,
				typeTransformers: DStoJS.defaultTypeTransformers,
				version: "jsonSchema7",
			},
		)).toMatchSnapshot();
	});

	it("renders a recursive lazy union", () => {
		const structureStore: {
			catalogNode?: DDataStructure.Structure;
		} = {};

		const catalogNode = DDataStructure.union([
			DDataStructure.object({
				kind: DDataStructure.literal("category"),
				name: DDataStructure.string([DDataStructure.notEmpty()]),
				children: DDataStructure.array(DDataStructure.lazy(() => structureStore.catalogNode!)),
			}),
			DDataStructure.object({
				kind: DDataStructure.literal("product"),
				sku: DDataStructure.string([DDataStructure.notEmpty()]),
				stock: DDataStructure.number([
					DDataStructure.integer(),
					DDataStructure.greaterThanOrEqual(0),
				]),
			}),
		]);

		structureStore.catalogNode = catalogNode;

		expect(DStoJS.render(
			catalogNode,
			{
				identifier: "CatalogNode",
				structureTransformers: DStoJS.defaultStructureTransformers,
				typeTransformers: DStoJS.defaultTypeTransformers,
				version: "jsonSchema7",
			},
		)).toMatchSnapshot();
	});
});
