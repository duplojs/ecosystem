import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoTS } from "@scripts";

describe("multipleOfConstraintTransformer", () => {
	it("renders positive and negative multiples", () => {
		const params = {
			identifier: "Value",
			structureTransformers: DStoTS.defaultStructureTransformers,
			typeTransformers: DStoTS.defaultTypeTransformers,
			constraintTransformers: DStoTS.defaultConstraintTransformers,
		};

		expect([
			DStoTS.render(DDataStructure.number([DDataStructure.multipleOf(2)]), params),
			DStoTS.render(DDataStructure.number([DDataStructure.multipleOf(-2)]), params),
		]).toMatchSnapshot();
	});

	it("rejects a non-finite multiple", () => {
		expect(() => DStoTS.render(
			DDataStructure.number([DDataStructure.multipleOf(Number.NaN)]),
			{
				identifier: "Value",
				structureTransformers: DStoTS.defaultStructureTransformers,
				typeTransformers: DStoTS.defaultTypeTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		)).toThrowErrorMatchingSnapshot();
	});
});
