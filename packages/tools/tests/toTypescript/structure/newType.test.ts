import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DModeling from "@duplojs/lang/modeling";
import { DStoTS } from "@scripts";

describe("newTypeStructureTransformer", () => {
	it("renders new types with zero, one or several dedicated constraints", () => {
		const params = {
			identifier: "Value",
			structureTransformers: DStoTS.defaultStructureTransformers,
			typeTransformers: DStoTS.defaultTypeTransformers,
			constraintTransformers: DStoTS.defaultConstraintTransformers,
		};

		expect([
			DStoTS.render(DModeling.NewTypeStructure("Score", DDataStructure.number(), []), params),
			DStoTS.render(DModeling.NewTypeStructure("Score", DDataStructure.number(), [DDataStructure.integer()]), params),
			DStoTS.render(DModeling.NewTypeStructure("Score", DDataStructure.number(), [DDataStructure.integer(), DDataStructure.safe()]), params),
			DStoTS.render(DModeling.NewTypeStructure("Score", DDataStructure.number([DDataStructure.positive()]), []), params),
		]).toMatchSnapshot();
	});

	it("renders a new typed customer profile", () => {
		expect(DStoTS.render(
			DModeling.NewTypeStructure("CustomerProfile", DDataStructure.object({
				id: DModeling.NewTypeStructure("CustomerId", DDataStructure.string(), []),
				email: DDataStructure.string([DDataStructure.email()]),
				segments: DDataStructure.array(DDataStructure.literal(["retail", "pro"])),
				preferences: DDataStructure.record(
					DDataStructure.string(),
					DDataStructure.union([
						DDataStructure.string(),
						DDataStructure.boolean(),
						DDataStructure.undefined(),
					]),
				),
			}), []),
			{
				identifier: "Value",
				structureTransformers: DStoTS.defaultStructureTransformers,
				typeTransformers: DStoTS.defaultTypeTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		)).toMatchSnapshot();
	});

	it("propagates an unsupported inner structure", () => {
		expect(() => DStoTS.render(
			DModeling.NewTypeStructure("Score", DDataStructure.number(), []),
			{
				identifier: "Value",
				structureTransformers: DStoTS.defaultStructureTransformers,
				typeTransformers: [],
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		)).toThrowErrorMatchingSnapshot();
	});

	it("propagates an unsupported dedicated constraint", () => {
		expect(() => DStoTS.render(
			DModeling.NewTypeStructure("Score", DDataStructure.number(), [DDataStructure.integer()]),
			{
				identifier: "Value",
				structureTransformers: DStoTS.defaultStructureTransformers,
				typeTransformers: DStoTS.defaultTypeTransformers,
				constraintTransformers: [],
			},
		)).toThrowErrorMatchingSnapshot();
	});

	it("with identifier structure", () => {
		const structure = DModeling.NewTypeStructure("Score", DDataStructure.number(), [])
			.addIdentifier("Test");

		expect(DStoTS.render(structure, {
			identifier: "Value",
			structureTransformers: DStoTS.defaultStructureTransformers,
			typeTransformers: DStoTS.defaultTypeTransformers,
			constraintTransformers: DStoTS.defaultConstraintTransformers,
		})).toMatchSnapshot();
	});
});
