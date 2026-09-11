import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DModeling from "@duplojs/lang/modeling";
import { DStoTS } from "@scripts";

describe("entityStructureTransformer", () => {
	it("renders an entity structure", () => {
		const identifier = DModeling.NewTypeStructure("Identifier", DDataStructure.number(), []);
		const structure = DModeling.EntityStructure("User", () => ({
			id: identifier,
			name: DDataStructure.string(),
		}));

		expect(DStoTS.render(structure, {
			identifier: "Value",
			structureTransformers: DStoTS.defaultStructureTransformers,
			typeTransformers: DStoTS.defaultTypeTransformers,
			constraintTransformers: DStoTS.defaultConstraintTransformers,
		})).toMatchSnapshot();
	});

	it("renders a product entity with relational fields", () => {
		const productId = DModeling.NewTypeStructure("ProductId", DDataStructure.string(), []);
		const structure = DModeling.EntityStructure("Product", () => ({
			id: productId,
			sku: DDataStructure.string([DDataStructure.notEmpty()]),
			categories: DDataStructure.array(DDataStructure.string()),
			stockByWarehouse: DDataStructure.record(
				DDataStructure.literal(["main", "outlet"]),
				DDataStructure.number([DDataStructure.integer()]),
			),
			metadata: DDataStructure.record(
				DDataStructure.string(),
				DDataStructure.union([
					DDataStructure.string(),
					DDataStructure.number(),
					DDataStructure.boolean(),
				]),
			),
		}));

		expect(DStoTS.render(structure, {
			identifier: "Value",
			structureTransformers: DStoTS.defaultStructureTransformers,
			typeTransformers: DStoTS.defaultTypeTransformers,
			constraintTransformers: DStoTS.defaultConstraintTransformers,
		})).toMatchSnapshot();
	});

	it("propagates an unsupported property", () => {
		const structure = DModeling.EntityStructure("User", () => ({
			name: DDataStructure.string(),
		}));

		expect(() => DStoTS.render(structure, {
			identifier: "Value",
			structureTransformers: DStoTS.defaultStructureTransformers,
			typeTransformers: [],
			constraintTransformers: DStoTS.defaultConstraintTransformers,
		})).toThrowErrorMatchingSnapshot();
	});

	it("with identifier structure", () => {
		const structure = DModeling.EntityStructure("User", () => ({
			id: DDataStructure.number(),
			name: DDataStructure.string(),
		})).addIdentifier("Test");

		expect(DStoTS.render(structure, {
			identifier: "Value",
			structureTransformers: DStoTS.defaultStructureTransformers,
			typeTransformers: DStoTS.defaultTypeTransformers,
			constraintTransformers: DStoTS.defaultConstraintTransformers,
		})).toMatchSnapshot();
	});
});
