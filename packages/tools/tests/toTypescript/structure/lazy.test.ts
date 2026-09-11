import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoTS } from "@scripts";

describe("lazyStructureTransformer", () => {
	it("renders a lazy structure", () => {
		expect(DStoTS.render(DDataStructure.lazy(() => DDataStructure.string()), {
			identifier: "Value",
			structureTransformers: DStoTS.defaultStructureTransformers,
			typeTransformers: DStoTS.defaultTypeTransformers,
			constraintTransformers: DStoTS.defaultConstraintTransformers,
		})).toMatchSnapshot();
	});

	it("renders a recursive catalog category", () => {
		const structureStore: {
			category?: DDataStructure.Structure;
		} = {};

		const category = DDataStructure.object({
			id: DDataStructure.string([DDataStructure.uuid()]),
			name: DDataStructure.string([DDataStructure.notEmpty()]),
			children: DDataStructure.array(
				DDataStructure.lazy(() => structureStore.category!),
			),
			parent: DDataStructure.union([
				DDataStructure.null(),
				DDataStructure.lazy(() => structureStore.category!),
			]),
		}).addIdentifier("CatalogCategory");

		structureStore.category = category;

		expect(DStoTS.render(category, {
			identifier: "CatalogCategory",
			structureTransformers: DStoTS.defaultStructureTransformers,
			typeTransformers: DStoTS.defaultTypeTransformers,
			constraintTransformers: DStoTS.defaultConstraintTransformers,
		})).toMatchSnapshot();
	});

	it("with identifier structure", () => {
		const structure = DDataStructure.lazy(() => DDataStructure.string())
			.addIdentifier("Test");

		expect(DStoTS.render(structure, {
			identifier: "Value",
			structureTransformers: DStoTS.defaultStructureTransformers,
			typeTransformers: DStoTS.defaultTypeTransformers,
			constraintTransformers: DStoTS.defaultConstraintTransformers,
		})).toMatchSnapshot();
	});
});
