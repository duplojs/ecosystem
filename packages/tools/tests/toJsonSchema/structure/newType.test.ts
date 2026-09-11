import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DModeling from "@duplojs/lang/modeling";
import { DStoJS } from "@scripts";

describe("newTypeStructureTransformer", () => {
	it("renders new types with and without dedicated constraints", () => {
		const params = {
			identifier: "Value",
			structureTransformers: DStoJS.defaultStructureTransformers,
			typeTransformers: DStoJS.defaultTypeTransformers,
			version: "jsonSchema7" as const,
		};

		expect([
			DStoJS.render(
				DModeling.NewTypeStructure("UserId", DDataStructure.string([DDataStructure.uuid()]), []),
				params,
			),
			DStoJS.render(
				DModeling.NewTypeStructure("Quantity", DDataStructure.number(), [
					DDataStructure.integer(),
					DDataStructure.greaterThanOrEqual(0),
				]),
				params,
			),
		]).toMatchSnapshot();
	});

	it("renders a new typed business object", () => {
		expect(DStoJS.render(
			DModeling.NewTypeStructure("CustomerProfile", DDataStructure.object({
				id: DModeling.NewTypeStructure("CustomerId", DDataStructure.string([DDataStructure.uuid()]), []),
				email: DDataStructure.string([DDataStructure.email()]),
				status: DDataStructure.literal(["active", "blocked"]),
				tags: DDataStructure.array(
					DDataStructure.string([DDataStructure.notEmpty()]),
					[DDataStructure.maxElements(5)],
				),
			}), []),
			{
				identifier: "Value",
				structureTransformers: DStoJS.defaultStructureTransformers,
				typeTransformers: DStoJS.defaultTypeTransformers,
				version: "jsonSchema7",
			},
		)).toMatchSnapshot();
	});

	it("throws when the inner structure is not supported", () => {
		expect(() => DStoJS.render(
			DModeling.NewTypeStructure("UserId", DDataStructure.string(), []),
			{
				identifier: "Value",
				structureTransformers: [DStoJS.newTypeStructureTransformer],
				typeTransformers: DStoJS.defaultTypeTransformers,
				version: "jsonSchema7",
			},
		)).toThrowErrorMatchingSnapshot();
	});
});
