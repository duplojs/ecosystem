import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoTS } from "@scripts";

describe("stringLengthEqualConstraintTransformer", () => {
	it("renders positive and negative lengths", () => {
		const params = {
			identifier: "Value",
			structureTransformers: DStoTS.defaultStructureTransformers,
			typeTransformers: DStoTS.defaultTypeTransformers,
			constraintTransformers: DStoTS.defaultConstraintTransformers,
		};

		expect([
			DStoTS.render(DDataStructure.string([DDataStructure.stringLengthEqual(2)]), params),
			DStoTS.render(DDataStructure.string([DDataStructure.stringLengthEqual(-2)]), params),
		]).toMatchSnapshot();
	});

	it("rejects a non-finite length", () => {
		expect(() => DStoTS.render(
			DDataStructure.string([DDataStructure.stringLengthEqual(Number.NaN)]),
			{
				identifier: "Value",
				structureTransformers: DStoTS.defaultStructureTransformers,
				typeTransformers: DStoTS.defaultTypeTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		)).toThrowErrorMatchingSnapshot();
	});
});
