import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoTS } from "@scripts";

describe("arrayLengthEqualConstraintTransformer", () => {
	it("renders positive and negative lengths", () => {
		const params = {
			identifier: "Value",
			structureTransformers: DStoTS.defaultStructureTransformers,
			typeTransformers: DStoTS.defaultTypeTransformers,
			constraintTransformers: DStoTS.defaultConstraintTransformers,
		};

		expect([
			DStoTS.render(DDataStructure.array(DDataStructure.number(), [DDataStructure.arrayLengthEqual(2)]), params),
			DStoTS.render(DDataStructure.array(DDataStructure.number(), [DDataStructure.arrayLengthEqual(-2)]), params),
		]).toMatchSnapshot();
	});

	it("rejects a non-finite length", () => {
		expect(() => DStoTS.render(
			DDataStructure.array(DDataStructure.number(), [DDataStructure.arrayLengthEqual(Number.NaN)]),
			{
				identifier: "Value",
				structureTransformers: DStoTS.defaultStructureTransformers,
				typeTransformers: DStoTS.defaultTypeTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		)).toThrowErrorMatchingSnapshot();
	});
});
